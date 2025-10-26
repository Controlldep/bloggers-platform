import { Request, Response } from 'express';
import {AuthService} from "../service/authService";
import {RequestWithBody} from "../../types/requestTypes";
import {newPasswordModel} from "../differenModels/newPasswordModel";

export async function createNewPassword(req: RequestWithBody<newPasswordModel>, res: Response) {
    const saveNewPassword = await AuthService.saveNewPassword(req.body.recoveryCode , req.body.newPassword);
    if (!saveNewPassword.success) {
        return res.status(400).send({ errorsMessages: [{ message: saveNewPassword.message, field: saveNewPassword.field }] });
    }
    res.sendStatus(204);
}