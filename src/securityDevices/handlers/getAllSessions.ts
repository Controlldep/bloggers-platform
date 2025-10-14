import { Request, Response } from 'express';
import {sessionService} from "../service/sessionService";
import {sessionViewModel} from "../models/sessionViewModel";

export async function getAllSessions(req: Request , res: Response) {
    const getSessions:sessionViewModel[] = await sessionService.getAllDevices(req.userId!);

    return res.status(200).send(getSessions)
}