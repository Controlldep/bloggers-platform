import { Request, Response } from 'express';
import {UsersService} from "../service/userService";
import {inject, injectable} from "inversify";

@injectable()
export class UsersController {

    constructor(@inject(UsersService) protected usersService: UsersService) {}

    async createUserHandler(req: Request , res: Response) {
        const createUser = await this.usersService.createUser(req.body);
        if(!createUser) return res.status(400).json({ errorsMessages: [{ field: 'login/email', message: 'User already exists' }]});

        res.status(201).send(createUser);

    }

    async deleteUserHandler(req: Request, res: Response) {
        const deleteUser = await this.usersService.deleteUser(req.params.id);
        if(!deleteUser) return res.sendStatus(404)

        res.sendStatus(204)
    }

    async getUsersHandler(req: Request , res: Response) {
        const getUsers = await this.usersService.getUsers(req.query);

        res.status(200).send(getUsers);
    }
}