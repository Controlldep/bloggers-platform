import { check, validationResult} from "express-validator";
import {NextFunction , Response , Request} from "express";


export const emailValidation = [
    check("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email format"),

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

]