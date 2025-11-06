import {sessionModel} from "../../securityDevices/models/sessionModel";
import {getClientIp} from "../helper/getClientIp";
import jwt from "jsonwebtoken";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";
import {RequestWithBody} from "../../types/requestTypes";
import {authModel} from "../differenModels/authModel";
import {Request, Response} from "express";
import {AuthService} from "../service/authService";
import {SessionService} from "../../securityDevices/service/sessionService";
import {JwtService} from "../service/jwtService";
import {newPasswordModel} from "../differenModels/newPasswordModel";
import {RefreshPayload} from "../differenModels/refreshType";
import {refreshModel} from "../differenModels/refreshModel";
import {RefreshTokenRepositories} from "../repositories/refreshTokenRepositories";
import {currentUserModel} from "../differenModels/currentUserModel";
import {UsersService} from "../../users/service/userService";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {

    constructor(
        @inject(SessionService) protected sessionService: SessionService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(AuthService) protected authService: AuthService,
        @inject(RefreshTokenRepositories) protected refreshTokenRepositories: RefreshTokenRepositories,
        @inject(UsersService) protected usersService: UsersService
    ) {}

    //TODO вынести логику
    async authHandler(req: RequestWithBody<authModel> , res: Response) {
        const user:WithId<userModel> | null = await this.authService.authUser(req.body);
        if(!user) return res.sendStatus(401)

        const deviceId = await this.sessionService.createDeviceID()
        const accessToken:{accessToken: string} = await this.jwtService.createAccessToken(user._id.toString());
        const refreshToken:string = await this.jwtService.createRefreshToken(user._id.toString() , deviceId)

        res.cookie("refreshToken" , refreshToken , {httpOnly: true , secure: true , maxAge: 20000});

        const ip:string = getClientIp(req as Request)
        const deviceTitle:string = req.headers['user-agent'] ?? 'Unknown device';
        const decoded:{ exp: number } = jwt.decode(refreshToken) as { exp: number };
        const expirationDate:string = new Date(decoded.exp * 1000).toISOString();

        const session:sessionModel = {
            userId: user._id.toString(),
            deviceId: deviceId,
            ip,
            deviceTitle,
            lastActiveDate: new Date().toISOString(),
            expirationDate
        }

        await this.sessionService.saveSession(session)

        return res.status(200).json(accessToken);
    }

    async createNewPassword(req: RequestWithBody<newPasswordModel>, res: Response) {
        const saveNewPassword = await this.authService.saveNewPassword(req.body.recoveryCode , req.body.newPassword);
        if (!saveNewPassword.success) {
            return res.status(400).send({ errorsMessages: [{ message: saveNewPassword.message, field: saveNewPassword.field }] });
        }
        res.sendStatus(204);
    }

    async logOutHandler(req: Request , res: Response) {
        const cookies = req.cookies.refreshToken;
        if (!cookies) return res.sendStatus(401);

        const verifyToken:RefreshPayload | null = await this.jwtService.verifyTokens(cookies);
        if (!verifyToken) return res.sendStatus(401);

        const { userId, jti, deviceId } = verifyToken;

        const findToken:refreshModel | null = await this.jwtService.findToken(userId, deviceId , jti);
        if (!findToken) return res.sendStatus(401);

        const session:WithId<sessionModel> | null = await this.sessionService.findSessionByDeviceId(deviceId);
        if (!session) return res.sendStatus(404);

        if (session.userId !== userId) return res.sendStatus(403);

        await this.refreshTokenRepositories.deleteSessionByDevice(userId, deviceId);
        await this.sessionService.deleteDeviceById(userId, deviceId);

        res.clearCookie("refreshToken", { httpOnly: true, secure: true });

        return res.sendStatus(204);
    }

    async meHandler(req: Request , res: Response) {
        const user:currentUserModel | null = await this.authService.meUser(req.userId!);
        if (!user) return res.sendStatus(401);

        return res.status(200).json(user);
    }

    async passwordRecoveryHandler(req: RequestWithBody<{ email: string }>, res: Response) {
        const findUserByEmail:WithId<userModel> | null = await this.usersService.findUserByEmail(req.body.email);
        if (!findUserByEmail) return res.sendStatus(204);

        await this.authService.passwordRecovery(findUserByEmail);
        return res.sendStatus(204);
    }

    async refreshTokenHandler(req: Request , res: Response) {
        const cookies = req.cookies.refreshToken;
        if (!cookies) return res.sendStatus(401);

        const verifyToken:RefreshPayload | null = await this.jwtService.verifyTokens(cookies);
        if(!verifyToken) return res.sendStatus(401);

        const { userId, jti, deviceId } = verifyToken;

        const token:refreshModel | null  = await this.jwtService.findToken(userId, deviceId, jti);
        if (!token) return res.sendStatus(401);

        const createToken:{accessToken:string} = await this.jwtService.createAccessToken(userId);
        const refreshToken:string = await this.jwtService.updateRefreshToken(userId , deviceId)

        const decoded:{ exp: number } = jwt.decode(refreshToken!) as { exp: number };
        await this.sessionService.updateLastActiveDate(userId, deviceId, decoded.exp);

        res.cookie("refreshToken" , refreshToken , {httpOnly: true , secure: true , maxAge: 2000000})

        return res.status(200).json(createToken);
    }

    async registrationEmailResending(req: Request , res: Response) {
        const result = await this.authService.resendRegistrationEmail(req.body.email);
        if (result === true) return res.sendStatus(204);

        res.status(400).send(result);
    }

    async registrationConfirmationHandler(req: Request , res: Response) {
        const confirmUser = await this.authService.registrationConfirmationUser(req.body.code);
        if (confirmUser === true) return res.sendStatus(204);

        res.status(400).send(confirmUser);
    }

    async sendAnEmailHandler(req: Request , res: Response) {
        const registrationUser:true| null = await this.authService.registerUser(req.body);
        if (registrationUser === true)return res.sendStatus(204);
    }

}