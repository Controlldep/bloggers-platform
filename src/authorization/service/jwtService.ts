import jwt from "jsonwebtoken";
import {settings} from "../../settings";
import * as crypto from "node:crypto";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import {refreshModel} from "../differenModels/refreshModel";
import {refreshTokenRepositories} from "../repositories/refreshTokenRepositories";
import {RefreshPayload} from "../differenModels/refreshType";


export const jwtService = {
    async createAccessToken(userId: string) {
        const token = jwt.sign({userId} , settings.JWT_SECRET , {expiresIn: '10s'});
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token , settings.JWT_SECRET);

            return result.userId;
        }catch (error) {
            return null;
        }
    },

    async createRefreshToken(userId: string , deviceId: string) {
        const jti = crypto.randomBytes(16).toString('hex');
        const hashJti = await bcrypt.hash(jti, 10);
        const refreshToken = jwt.sign({userId ,jti , deviceId} , settings.JWT_SECRET_REFRESH , {expiresIn: '20s'});
        const saveToken:refreshModel = {
            userId: userId,
            jtiHash: hashJti,
            deviceId,
            expiresAt: add(new Date(), { seconds: 20}),
        };

        await refreshTokenRepositories.saveRefreshToken(saveToken);

        return refreshToken;
    },

    async verifyTokens(token: string) {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET_REFRESH) as RefreshPayload;

            const tokenInDb = await refreshTokenRepositories.findTokenByDevice(decoded.userId, decoded.deviceId);
            if (!tokenInDb) return null;

            return decoded;
        } catch(e) {
            return null;
        }
    },

    async findToken(userId: string, deviceId: string, jti: string) {
        const session = await refreshTokenRepositories.findTokenByDevice(userId, deviceId);
        if (!session) return null;

        const isValid = await bcrypt.compare(jti, session.jtiHash);
        if (!isValid) return null;

        return session;
    },


    async updateRefreshToken(userId: string, deviceId: string) {
        const jti = crypto.randomBytes(16).toString('hex');
        const hashJti = await bcrypt.hash(jti, 10);
        const refreshToken = jwt.sign({userId, deviceId, jti}, settings.JWT_SECRET_REFRESH, {expiresIn: '20s'});
        const decoded = jwt.decode(refreshToken) as { exp: number };

        const updateToken = await refreshTokenRepositories.updateRefreshToken(userId , deviceId , hashJti , decoded.exp);
        if (!updateToken) return null;

        return refreshToken
    }

}

