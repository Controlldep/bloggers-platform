import {Router} from "express";
import {authHandler} from "./authHandler";
import {loginValidation} from "./authValidation";
import {meHandler} from "./meHandler";
import {authMiddleware} from "./middleware/authMiddleware";


export const authRouter = Router();

authRouter
    .post('/auth/login' , loginValidation, authHandler , )
    .get('/auth/me' ,authMiddleware, meHandler)