import { Request, Response } from 'express';
import {UsersService} from "../service/userService";

export async function deleteUserHandler(req: Request, res: Response) {
    const deleteUser = await UsersService.deleteUser(req.params.id);

    if(deleteUser) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}