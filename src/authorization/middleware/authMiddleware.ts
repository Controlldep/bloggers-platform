import  {NextFunction ,Request , Response } from "express";
import {jwtService} from "../jwtService/jwtService";
import {UsersService} from "../../users/service/userService";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwtService.getUserIdByToken(token);

    if (!userId) {
        return res.sendStatus(401);
    }

    const dbUser = await UsersService.findUserById(userId);

    if (!dbUser) {
        return res.sendStatus(401);
    }

    req.userId = userId;

    return next();
};
