import {authModel} from "../differenModels/authModel";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../../users/repositories/usersRepository";
import {userInputModel} from "../../users/differentModels/userInputModel";
import {userModel} from "../../users/differentModels/userModels";
const { v4: uuidv4 } = require("uuid");
import { add } from "date-fns";
import {emailService} from "./emailService";
import {WithId} from "mongodb";
import {currentUserModel} from "../differenModels/currentUserModel";

export const AuthService = {

    async registerUser(user: userInputModel):Promise<true | null> {
        const passwordHash:string = await bcrypt.hash(user.password, 10);

        function generateConfirmationCode(): string {
            return Math.floor(1000 + Math.random() * 9000).toString();
        }
        const createUser:userModel =  {
            login: user.login,
            email: user.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            confirmationCode: generateConfirmationCode(),
            expirationDate: add(new Date(), { minutes: 10}),
            isConfirmed: false
        }
        const userCreated:WithId<userModel> | null = await UsersRepository.createUser(createUser);
        if(!userCreated) return null

        try {
            emailService.sendRegistrationEmail(userCreated.email, userCreated.confirmationCode!);
        } catch (e) {
            console.log(e);
        }

        return true;
    },
    //TODO вынести все эти проверки в мидлу
    async registrationConfirmationUser(code: string) {
        const user = await UsersRepository.findUserByConfirmationCode(code);

        if (!user) {
            return {
                errorsMessages: [{ message: "Incorrect confirmation code", field: "code" }]
            };
        }

        if (user.expirationDate! < new Date()) {
            return {
                errorsMessages: [{ message: "Code expired", field: "code" }]
            };
        }

        if (user.isConfirmed === true) {
            return {
                errorsMessages: [{ message: "Already confirmed", field: "code" }]
            };
        }

        await UsersRepository.verifyUser(user._id);
        return true;
    },

    async resendRegistrationEmail(email: string) {
        const user:WithId<userModel> | null  = await UsersRepository.findByLoginOrEmail( undefined , email);

        if (!user) {
            return {
                errorsMessages: [
                    {message: "Email not found", field: "email"}
                ]
            };
        }

        if (user.isConfirmed) {
            return {
                errorsMessages: [
                    {message: "Email is already confirmed", field: "email"}
                ]
            };
        }

        const newCode = uuidv4();
        const newExpiration:Date = add(new Date(), {minutes: 10});

        await UsersRepository.updateConfirmation(user._id, newCode, newExpiration);

        emailService.sendRegistrationEmail(user.email, newCode);

        return true;
    },

    async authUser (data: authModel) {
        const user:WithId<userModel> | null = await UsersRepository.findByLoginOrEmail(data.loginOrEmail , data.loginOrEmail);

        if(!user) return null;

        const isPasswordValid:boolean = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) return null;

        return user;
    },

    async meUser(id:string):Promise<currentUserModel | null> {
        const user:WithId<userModel> | null = await UsersRepository.getUserByID(id);
        if (!user) return null

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    },

    async passwordRecovery(user: WithId<userModel>):Promise<void> {
        const newCode = uuidv4();
        const newExpiration:Date = add(new Date(), {minutes: 10});
        await UsersRepository.updateConfirmation(user._id, newCode, newExpiration);

        await emailService.passwordRecovery(user.email, newCode);
    },

    async saveNewPassword(code: string ,password: string) {
        const findUserInDb:WithId<userModel> | null= await UsersRepository.findUserByConfirmationCode(code)
        if (!findUserInDb) return { success: false, field: "recoveryCode", message: "Invalid recovery code" }
        //TODO вынести в хелпер
        if (findUserInDb.expirationDate! < new Date()) {
            return { success: false, field: "recoveryCode", message: "Invalid recovery code" };
        }

        if (password.length < 6 || password.length > 20) {
            return { success: false, field: "newPassword", message: "Invalid new password format" };
        }
        //TODO вынести в хелпер проверку кода


        const passwordHash:string = await bcrypt.hash(password, 10);
       const result = await UsersRepository.updatePassword(findUserInDb._id, passwordHash);
        return { success: true };
    }

}
