import { Request, Response } from 'express';
import {sessionService} from "../service/sessionService";
import {refreshTokenRepositories} from "../../authorization/repositories/refreshTokenRepositories";

export async function deleteAllSession(req: Request, res: Response) {
    await sessionService.deleteAllDevicesExceptCurrent(req.userId!, req.deviceId!);
    await refreshTokenRepositories.deleteAllTokensExceptCurrent(req.userId!, req.deviceId!)
    return res.sendStatus(204);
}