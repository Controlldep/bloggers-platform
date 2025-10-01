import {Router} from "express";
import {authHandler} from "../authHandler/authHandler";
import {loginValidation} from "../middleware/authValidation";
import {meHandler} from "../authHandler/meHandler";
import {authMiddleware} from "../middleware/authMiddleware";
import {sendAnEmailHandler} from "../authHandler/sendAnEmailHandler";
import {registrationConfirmationHandler} from "../authHandler/registrationСonfirmationHandler";
import {registrationEmailResending} from "../authHandler/registrationEmailResending";
import {registrationValidation} from "../middleware/registrationValidation";


export const authRouter = Router();

authRouter
    .post('/auth/login' , loginValidation, authHandler , )
    .get('/auth/me' ,authMiddleware, meHandler)
    .post('/auth/registration' ,registrationValidation ,sendAnEmailHandler)
    .post('/auth/registration-confirmation' , registrationConfirmationHandler)
    .post('/auth/registration-email-resending' , registrationEmailResending)

