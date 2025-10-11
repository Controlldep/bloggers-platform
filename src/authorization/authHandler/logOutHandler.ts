
import { Request, Response } from 'express';
import {jwtService} from "../service/jwtService";
import {sessionService} from "../../securityDevices/service/sessionService";
import {refreshTokenRepositories} from "../repositories/refreshTokenRepositories";

export async function logOutHandler(req: Request , res: Response) {
    const cookies = req.cookies.refreshToken;
    if (!cookies) return res.sendStatus(401);
    console.log('Cookies:', cookies);
    const verifyToken = await jwtService.verifyTokens(cookies);
    if (!verifyToken) return res.sendStatus(401);
    console.log('VerifyToken result:', verifyToken);
    const { userId, jti, deviceId } = verifyToken;

    const token = await jwtService.findToken(userId, deviceId , jti);
    if (!token) return res.sendStatus(401);

    const session = await sessionService.findSessionByDeviceId(deviceId);
    if (!session) return res.sendStatus(404);

    if (session.userId !== userId) return res.sendStatus(403);

    await refreshTokenRepositories.deleteSessionByDevice(userId, deviceId);
    await sessionService.deleteDeviceById(userId, deviceId);

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res.sendStatus(204);
}

