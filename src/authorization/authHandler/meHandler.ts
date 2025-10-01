import { Request, Response } from 'express';
import {AuthService} from "../service/authService";

export async function meHandler(req: Request , res: Response) {
    if (!req.userId) {
        return res.sendStatus(401);
    }

    const meUser = await AuthService.meUser(req.userId);
    if (!meUser) {
        return res.sendStatus(401);
    }

    return res.status(200).json(meUser);
}