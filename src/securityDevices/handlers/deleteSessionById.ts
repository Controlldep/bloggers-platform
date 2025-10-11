import { Request, Response } from 'express';
import {sessionService} from "../service/sessionService";
import {refreshTokenRepositories} from "../../authorization/repositories/refreshTokenRepositories";

export async function deleteSessionById(req: Request , res: Response) {
    const sessionDevice = await sessionService.findSessionByDeviceId(req.params.id);
    if(!sessionDevice) return res.sendStatus(404);
    //TODO вынести через сервис
    if (sessionDevice.userId !== req.userId) return  res.sendStatus(403);
    await sessionService.deleteDeviceById(req.userId , req.params.id);
    await refreshTokenRepositories.deleteSessionByDevice(req.userId, req.params.id);

    return res.sendStatus(204)
}