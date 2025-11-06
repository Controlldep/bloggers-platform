import {Router} from "express";
import {loginValidation} from "../middleware/authValidation";
import {authAccessMiddleware} from "../middleware/authAccessMiddleware";
import {registrationValidation} from "../middleware/registrationValidation";
import {
    registrationLimiter,
    loginLimiter,
    emailResendingLimiter,
    newPasswordLimiter,
    registrationConfirmationLimiter,
    passwordRecoveryLimiter
} from "../middleware/rateLimitMidlleware";
import {emailValidation} from "../middleware/emailValidation";
import {AuthController} from "../controllers/authController";
import {container} from "../../compositionRoot/compositionRoot";
import {JwtService} from "../service/jwtService";
import {UsersService} from "../../users/service/userService";

const authController = container.get(AuthController)
const jwtService = container.get(JwtService);
const usersService = container.get(UsersService);

export const authRouter:Router = Router();

authRouter
    .post('/auth/login' , loginLimiter , loginValidation, authController.authHandler.bind(authController))
    .get('/auth/me' ,authAccessMiddleware(jwtService , usersService), authController.meHandler.bind(authController))
    .post('/auth/registration' ,registrationLimiter , registrationValidation ,authController.sendAnEmailHandler.bind(authController))
    .post('/auth/registration-confirmation' , registrationConfirmationLimiter , authController.registrationConfirmationHandler.bind(authController))
    .post('/auth/registration-email-resending' , emailResendingLimiter , authController.registrationEmailResending.bind(authController))
    .post('/auth/refresh-token' , authController.refreshTokenHandler.bind(authController))
    .post('/auth/logout' , authController.logOutHandler.bind(authController))
    .post('/auth/password-recovery', passwordRecoveryLimiter , emailValidation, authController.passwordRecoveryHandler.bind(authController))
    .post('/auth/new-password' , newPasswordLimiter , authController.createNewPassword.bind(authController))

