import { check, validationResult} from "express-validator";
import {NextFunction , Response , Request} from "express";

export const userValidation = [
    check("login")
        .trim()
        .isLength({ min: 3, max: 10 })
        .withMessage("Login must be between 3 and 10 characters")
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage("Login can contain only letters, numbers, _ and -"),

    check("email")
        .trim()
        .isEmail()
        .withMessage("Email must be valid"),

    check("password")
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),

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
];