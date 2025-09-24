import { Request, Response } from 'express';
import {AuthService} from "./authService";
import {jwtService} from "./jwtService/jwtService";

export async function authHandler(req: Request , res: Response) {
    const authUser = await AuthService.authUser(req.body);
    if(!authUser) {
        return res.sendStatus(401)
    }

    const token = await jwtService.createJWT(authUser._id.toString());

    return res.status(200).json(token);
}