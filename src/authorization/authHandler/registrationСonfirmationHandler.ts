import {Request, Response} from "express";
import {AuthService} from "../service/authService";


export async function registrationConfirmationHandler(req: Request , res: Response) {
    const confirmUser = await AuthService.registrationConfirmationUser(req.body.code);
    if (confirmUser === true) return res.sendStatus(204);

    res.status(400).send(confirmUser);
}