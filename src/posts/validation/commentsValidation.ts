import { check, validationResult} from "express-validator";
import { NextFunction, Request, Response } from "express";


export const commentsValidation = [
    check("content")
        .trim()
        .isLength({ min: 20 , max: 300})
        .withMessage("Invalid content"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                message: err.msg,
                field: (err as any).path
            }));
            return res.status(400).json({ errorsMessages: formattedErrors });
        }
        next();
    }

]