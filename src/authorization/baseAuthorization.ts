import { Request, Response , NextFunction } from 'express';

export const baseAuthorization = (req: Request, res: Response, next: NextFunction) => {

    const token = 'Basic YWRtaW46cXdlcnR5';
    const urlToken = req.headers['authorization'];

    if(token === urlToken) {
        next()
        return
    }else {
        res.sendStatus(401);
    }


}