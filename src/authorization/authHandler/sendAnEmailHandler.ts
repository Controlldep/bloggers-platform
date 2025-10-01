import {Request, Response} from "express";
import {AuthService} from "../service/authService";

export async function sendAnEmailHandler(req: Request , res: Response) {
        const registrationUser = await AuthService.registerUser(req.body);

        if (registrationUser === true) {
            return res.sendStatus(204);
        }

        if (registrationUser?.errorsMessages) {
            return res.status(400).send(registrationUser);
        }

}
