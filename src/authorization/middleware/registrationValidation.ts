import { Request, Response, NextFunction } from "express";
import { UsersRepository } from "../../users/repositories/usersRepository";
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

    async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        const errorsMessages = result.array({ onlyFirstError: true }).map(e => ({
            message: e.msg,
            field: (e as any).path
        }));


        const hasFieldError = (field: string) => errorsMessages.some(e => e.field === field);

        if (!hasFieldError('login')) {
            const userByLogin = await UsersRepository.findByLoginOrEmail(req.body.login, undefined);
            if (userByLogin) errorsMessages.push({ message: 'Login already exists', field: 'login' });
        }

        if (!hasFieldError('email')) {
            const userByEmail = await UsersRepository.findByLoginOrEmail(undefined, req.body.email);
            if (userByEmail) errorsMessages.push({ message: 'Email already exists', field: 'email' });
        }

        if (errorsMessages.length > 0) {
            return res.status(400).json({ errorsMessages });
        }

        next();
    }
];