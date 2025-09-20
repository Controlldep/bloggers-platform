import {Router} from "express";
import {authHandler} from "./authHandler";
import {loginValidation} from "./authValidation";


export const authRouter = Router();

authRouter
    .post('/auth/login' , loginValidation, authHandler)