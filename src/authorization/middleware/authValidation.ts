import { body, validationResult } from "express-validator";
import {NextFunction , Response , Request} from "express";

export const loginValidation = [
    body("loginOrEmail")
        .trim()
        .notEmpty()
        .withMessage("Login or email cannot be empty"),

    body("password")
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),

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
];