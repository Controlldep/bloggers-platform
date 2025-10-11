import { Request, Response , NextFunction} from 'express';
import {jwtService} from "../../authorization/service/jwtService";


export const authRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies.refreshToken;
    if (!cookies) return res.sendStatus(401);

    const verifyToken = await jwtService.verifyTokens(cookies);
    if (!verifyToken) return res.sendStatus(401);

    req.userId = verifyToken.userId;
    req.deviceId = verifyToken.deviceId;

    return next();
};