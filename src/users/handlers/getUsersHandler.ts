import { Request, Response } from 'express';
import {UsersService} from "../service/userService";


export async function getUsersHandler(req: Request , res: Response) {
    const getUsers = await UsersService.getUsers(req.query);

    res.status(200).send(getUsers);
}