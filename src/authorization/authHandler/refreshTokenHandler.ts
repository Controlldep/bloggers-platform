import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import {jwtService} from "../service/jwtService";

import {sessionService} from "../../securityDevices/service/sessionService";


export async function refreshTokenHandler(req: Request , res: Response) {
    const cookies = req.cookies.refreshToken;
    console.log("fir cookies", cookies)
    if (!cookies) return res.sendStatus(401);
    console.log("cookies.refreshtoken", cookies)

    const verifyToken = await jwtService.verifyTokens(cookies);
    if(!verifyToken) return res.sendStatus(401);

    const { userId, jti, deviceId } = verifyToken;

    const token = await jwtService.findToken(userId, deviceId, jti);
    if (!token) return res.sendStatus(401);

    const createToken = await jwtService.createAccessToken(userId);
    const refreshToken = await jwtService.updateRefreshToken(userId , deviceId)

    const decoded = jwt.decode(refreshToken!) as { exp: number };
    await sessionService.updateLastActiveDate(userId, deviceId, decoded.exp);

    res.cookie("refreshToken" , refreshToken , {httpOnly: true , secure: true , maxAge: 20000})

    return res.status(200).json(createToken);
}

