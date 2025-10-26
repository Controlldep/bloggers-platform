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
import {
    registrationLimiter,
    loginLimiter,
    emailResendingLimiter,
    newPasswordLimiter,
    registrationConfirmationLimiter,
    passwordRecoveryLimiter
} from "../middleware/rateLimitMidlleware";
import {passwordRecoveryHandler} from "../authHandler/passwordRecoveryHandler";
import {createNewPassword} from "../authHandler/createNewPassword";
import {emailValidation} from "../middleware/emailValidation";


export const authRouter:Router = Router();
authRouter
    .post('/auth/login' , loginLimiter , loginValidation, authHandler)
    .get('/auth/me' ,authAccessMiddleware, meHandler)
    .post('/auth/registration' ,registrationLimiter , registrationValidation ,sendAnEmailHandler)
    .post('/auth/registration-confirmation' , registrationConfirmationLimiter , registrationConfirmationHandler)
    .post('/auth/registration-email-resending' , emailResendingLimiter , registrationEmailResending)
    .post('/auth/refresh-token' , refreshTokenHandler)
    .post('/auth/logout' , logOutHandler)
    .post('/auth/password-recovery', passwordRecoveryLimiter , emailValidation,passwordRecoveryHandler)
    .post('/auth/new-password' , newPasswordLimiter , createNewPassword)

