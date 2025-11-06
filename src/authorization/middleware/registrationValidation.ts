import { Request, Response, NextFunction } from "express";
import {check, validationResult} from "express-validator";

export const registrationValidation = [
    check('login')
        .trim()
        .isLength({ min: 3, max: 10 }).withMessage('Login length should be 3–10 symbols')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login has invalid characters'),

    check('password')
        .isLength({ min: 6, max: 20 }).withMessage('Password length should be 6–20 symbols'),

    check('email')
        .isEmail().withMessage('Invalid email format'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map((err: any) => ({
                message: err.msg,
                field: err.path || err.param
            }));
            return res.status(400).json({ errorsMessages: formattedErrors });
        }
        next();
    }
];