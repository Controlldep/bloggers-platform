import {Request, Response} from "express";
import {AuthService} from "../service/authService";


export async function registrationEmailResending(req: Request , res: Response) {
    const email = req.body.email;
    const result = await AuthService.resendRegistrationEmail(email);

    if (result === true) {
        return res.sendStatus(204);
    }

    res.status(400).send(result);
}