import { Request, Response } from 'express';
import {RequestWithBody} from "../../types/requestTypes";
import {UsersService} from "../../users/service/userService";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";
import {AuthService} from "../service/authService";

export async function passwordRecoveryHandler(req: RequestWithBody<{ email: string }>, res: Response) {
    const findUserByEmail:WithId<userModel> | null = await UsersService.findUserByEmail(req.body.email);
    if (!findUserByEmail) return res.sendStatus(204);

    await AuthService.passwordRecovery(findUserByEmail);
    return res.sendStatus(204);
}