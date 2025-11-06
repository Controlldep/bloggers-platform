import jwt from "jsonwebtoken";
import {settings} from "../../settings";
import * as crypto from "node:crypto";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import {refreshModel} from "../differenModels/refreshModel";
import {RefreshTokenRepositories} from "../repositories/refreshTokenRepositories";
import {RefreshPayload} from "../differenModels/refreshType";
import {inject, injectable} from "inversify";

@injectable()
export class JwtService {

    constructor(@inject(RefreshTokenRepositories) protected refreshTokenRepositories: RefreshTokenRepositories) {}

    async createAccessToken(userId: string) {
        const token:string = jwt.sign({userId} , settings.JWT_SECRET , {expiresIn: '10m'});
        return {
            accessToken: token
        }
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token , settings.JWT_SECRET);
            return result.userId;
        }catch (error) {
            return null;
        }
    }

    async createRefreshToken(userId: string , deviceId: string) {
        const jti:string  = crypto.randomBytes(16).toString('hex');
        const hashJti:string  = await bcrypt.hash(jti, 10);
        const refreshToken:string  = jwt.sign({userId ,jti , deviceId} , settings.JWT_SECRET_REFRESH , {expiresIn: '20m'});
        const saveToken:refreshModel = {
            userId: userId,
            jtiHash: hashJti,
            deviceId,
            expiresAt: add(new Date(), { seconds: 20}),
        };

        await this.refreshTokenRepositories.saveRefreshToken(saveToken);

        return refreshToken;
    }

    async verifyTokens(token: string) {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET_REFRESH) as RefreshPayload;

            const tokenInDb = await this.refreshTokenRepositories.findTokenByDevice(decoded.userId, decoded.deviceId);
            if (!tokenInDb) return null;

            return decoded;
        } catch(e) {
            return null;
        }
    }

    async findToken(userId: string, deviceId: string, jti: string):Promise<refreshModel | null> {
        const session:refreshModel | null = await this.refreshTokenRepositories.findTokenByDevice(userId, deviceId);
        if (!session) return null;

        const isValid = await bcrypt.compare(jti, session.jtiHash);
        if (!isValid) return null;

        return session;
    }

    async updateRefreshToken(userId: string, deviceId: string):Promise<string> {
        const jti:string = crypto.randomBytes(16).toString('hex');
        const hashJti:string = await bcrypt.hash(jti, 10);
        const refreshToken:string = jwt.sign({userId, deviceId, jti}, settings.JWT_SECRET_REFRESH, {expiresIn: '20s'});
        const decoded:{ exp: number } = jwt.decode(refreshToken) as { exp: number };

       await this.refreshTokenRepositories.updateRefreshToken(userId , deviceId , hashJti , decoded.exp);

        return refreshToken
    }

}

