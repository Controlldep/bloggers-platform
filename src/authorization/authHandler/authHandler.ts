import { Request, Response } from 'express';
import {AuthService} from "../service/authService";
import {jwtService} from "../service/jwtService";
import {sessionService} from "../../securityDevices/service/sessionService";
import {sessionModel} from "../../securityDevices/models/sessionModel";
import {getClientIp} from "../helper/getClientIp";
import jwt from "jsonwebtoken";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";
import {RequestWithBody} from "../../types/requestTypes";
import {authModel} from "../differenModels/authModel";

export async function authHandler(req: RequestWithBody<authModel> , res: Response) {
    const user:WithId<userModel> | null = await AuthService.authUser(req.body);
    if(!user) return res.sendStatus(401)

    const deviceId = await sessionService.createDeviceID()
    const accessToken:{accessToken: string} = await jwtService.createAccessToken(user._id.toString());
    const refreshToken:string = await jwtService.createRefreshToken(user._id.toString() , deviceId)

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

    await sessionService.saveSession(session)

    return res.status(200).json(accessToken);
}