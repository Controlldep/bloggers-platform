import { Request, Response } from 'express';
import {UsersService} from "../service/userService";

export async function createUserHandler(req: Request , res: Response) {
    const createUser = await UsersService.createUser(req.body);

    if(createUser) {
        res.status(201).send(createUser);
    }else {
        res.status(400).json({ errorsMessages: [{ field: 'login/email', message: 'User already exists' }]});
    }
}