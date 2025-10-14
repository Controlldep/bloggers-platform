import { Request, Response } from 'express';
import {AuthService} from "../service/authService";
import {currentUserModel} from "../differenModels/currentUserModel";

export async function meHandler(req: Request , res: Response) {
    const user:currentUserModel | null = await AuthService.meUser(req.userId!);
    if (!user) return res.sendStatus(401);

    return res.status(200).json(user);
}