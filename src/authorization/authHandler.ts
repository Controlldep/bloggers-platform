import { Request, Response } from 'express';
import {AuthService} from "./authService";

export async function authHandler(req: Request , res: Response) {
    const authUser = await AuthService.authUser(req.body);
    if(authUser) {
        res.sendStatus(204);
    }else {
        res.sendStatus(401)
    }
}