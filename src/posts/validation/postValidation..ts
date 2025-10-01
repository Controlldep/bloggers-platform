import { check, validationResult} from "express-validator";
import { NextFunction, Request, Response } from "express";

export const postInputValidation = [
    check("title")
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("Invalid title"),

    check("shortDescription")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Invalid shortDescription"),

    check("content")
        .trim()
        .isLength({ min: 2, max: 1000 })
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
];