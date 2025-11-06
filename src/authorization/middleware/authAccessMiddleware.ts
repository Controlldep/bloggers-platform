import  {NextFunction ,Request , Response } from "express";
import {JwtService} from "../service/jwtService";
import {UsersService} from "../../users/service/userService";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";


export const authAccessMiddleware = (jwtService: JwtService, usersService: UsersService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) return res.sendStatus(401);

        const token: string = req.headers.authorization.split(" ")[1];
        const userId = await jwtService.getUserIdByToken(token);
        if (!userId) return res.sendStatus(401);

        const dbUser: WithId<userModel> | null = await usersService.findUserById(userId);

        if (!dbUser) return res.sendStatus(401);

        req.userId = userId;

        next();
    };
};
