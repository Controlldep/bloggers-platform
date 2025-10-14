import {Router} from "express";
import {authHandler} from "../authHandler/authHandler";
import {loginValidation} from "../middleware/authValidation";
import {meHandler} from "../authHandler/meHandler";
import {authAccessMiddleware} from "../middleware/authAccessMiddleware";
import {sendAnEmailHandler} from "../authHandler/sendAnEmailHandler";
import {registrationConfirmationHandler} from "../authHandler/registrationСonfirmationHandler";
import {registrationEmailResending} from "../authHandler/registrationEmailResending";
import {registrationValidation} from "../middleware/registrationValidation";
import {refreshTokenHandler} from "../authHandler/refreshTokenHandler";
import {logOutHandler} from "../authHandler/logOutHandler";
import {rateLimitMiddleware, loginLimiter, emailReserndingLimiter} from "../middleware/rateLimitMidlleware";


export const authRouter:Router = Router();

authRouter
    .post('/auth/login' , loginLimiter , loginValidation, authHandler)
    .get('/auth/me' ,authAccessMiddleware, meHandler)
    .post('/auth/registration' ,rateLimitMiddleware , registrationValidation ,sendAnEmailHandler)
    .post('/auth/registration-confirmation' , rateLimitMiddleware , registrationConfirmationHandler)
    .post('/auth/registration-email-resending' , emailReserndingLimiter , registrationEmailResending)
    .post('/auth/refresh-token' , refreshTokenHandler)
    .post('/auth/logout' , logOutHandler)

