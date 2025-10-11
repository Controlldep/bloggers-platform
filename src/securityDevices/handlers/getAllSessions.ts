import { Request, Response } from 'express';
import {sessionService} from "../service/sessionService";

export async function getAllSessions(req: Request , res: Response) {
    const getSessions = await sessionService.getAllDevices(req.userId!);

    return res.status(200).send(getSessions)
}