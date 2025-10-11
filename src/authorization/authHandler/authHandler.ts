import { Request, Response } from 'express';
import {AuthService} from "../service/authService";
import {jwtService} from "../service/jwtService";
import {sessionService} from "../../securityDevices/service/sessionService";
import {sessionModel} from "../../securityDevices/models/sessionModel";
import {getClientIp} from "../helper/getClientIp";
import jwt from "jsonwebtoken";
export async function authHandler(req: Request , res: Response) {
    const authUser = await AuthService.authUser(req.body);
    if(!authUser) {
        return res.sendStatus(401)
    }

    const deviceId = await sessionService.createDeviceID()
    const token = await jwtService.createAccessToken(authUser._id.toString());
    const refreshToken = await jwtService.createRefreshToken(authUser._id.toString() , deviceId)

    res.cookie("refreshToken" , refreshToken , {httpOnly: true , secure: true , maxAge: 20000});

    const ip = getClientIp(req)
    const deviceTitle = req.headers['user-agent'] ?? 'Unknown device';
    const decoded = jwt.decode(refreshToken) as { exp: number };
    const expirationDate = new Date(decoded.exp * 1000).toISOString();
    const session:sessionModel = {
        userId: authUser._id.toString(),
        deviceId: deviceId,
        ip,
        deviceTitle,
        lastActiveDate: new Date().toISOString(),
        expirationDate
    }
    const createSession = await sessionService.saveSession(session)

    return res.status(200).json(token);
}