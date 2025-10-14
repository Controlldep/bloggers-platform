import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import {jwtService} from "../service/jwtService";

import {sessionService} from "../../securityDevices/service/sessionService";
import {RefreshPayload} from "../differenModels/refreshType";
import {refreshModel} from "../differenModels/refreshModel";


export async function refreshTokenHandler(req: Request , res: Response) {
    const cookies = req.cookies.refreshToken;
    if (!cookies) return res.sendStatus(401);

    const verifyToken:RefreshPayload | null = await jwtService.verifyTokens(cookies);
    if(!verifyToken) return res.sendStatus(401);

    const { userId, jti, deviceId } = verifyToken;

    const token:refreshModel | null  = await jwtService.findToken(userId, deviceId, jti);
    if (!token) return res.sendStatus(401);

    const createToken:{accessToken:string} = await jwtService.createAccessToken(userId);
    const refreshToken:string = await jwtService.updateRefreshToken(userId , deviceId)

    const decoded:{ exp: number } = jwt.decode(refreshToken!) as { exp: number };
    await sessionService.updateLastActiveDate(userId, deviceId, decoded.exp);

    res.cookie("refreshToken" , refreshToken , {httpOnly: true , secure: true , maxAge: 20000})

    return res.status(200).json(createToken);
}

