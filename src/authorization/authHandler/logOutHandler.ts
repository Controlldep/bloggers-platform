
import { Request, Response } from 'express';
import {jwtService} from "../service/jwtService";
import {sessionService} from "../../securityDevices/service/sessionService";
import {refreshTokenRepositories} from "../repositories/refreshTokenRepositories";
import {WithId} from "mongodb";
import {refreshModel} from "../differenModels/refreshModel";
import {sessionModel} from "../../securityDevices/models/sessionModel";
import {RefreshPayload} from "../differenModels/refreshType";

export async function logOutHandler(req: Request , res: Response) {
    const cookies = req.cookies.refreshToken;
    if (!cookies) return res.sendStatus(401);

    const verifyToken:RefreshPayload | null = await jwtService.verifyTokens(cookies);
    if (!verifyToken) return res.sendStatus(401);

    const { userId, jti, deviceId } = verifyToken;

    const findToken:refreshModel | null = await jwtService.findToken(userId, deviceId , jti);
    if (!findToken) return res.sendStatus(401);

    const session:WithId<sessionModel> | null = await sessionService.findSessionByDeviceId(deviceId);
    if (!session) return res.sendStatus(404);

    if (session.userId !== userId) return res.sendStatus(403);

    await refreshTokenRepositories.deleteSessionByDevice(userId, deviceId);
    await sessionService.deleteDeviceById(userId, deviceId);

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res.sendStatus(204);
}

