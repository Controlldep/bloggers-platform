
import { check, validationResult} from "express-validator";
import { NextFunction, Request, Response } from "express";
// TODO: переименовать urlPattern → websiteUrlPattern (чуть точнее по смыслу)
const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogsInputValidation = [
    check("name")
        .trim()
        .isLength({ min: 2, max: 15 })
        .withMessage("Invalid name"),

    check("description")
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage("Invalid description"),

    check("websiteUrl")
        .trim()
        .isLength({ max: 100 })
        .withMessage("Website URL too long")
        .matches(urlPattern)
        .withMessage("Invalid websiteUrl"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                message: err.msg ,
                field: (err as any).path
            }));
            return res.status(400).json({ errorsMessages: formattedErrors });
        }
        next();
    }
];
