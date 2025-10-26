import { body, validationResult } from "express-validator";
import {NextFunction , Response , Request} from "express";


export const emailValidation = [
    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email format"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                message: err.msg,
                field: (err as any).param
            }));
            return res.status(400).json({ errorsMessages: formattedErrors });
        }
        next();
    }

]