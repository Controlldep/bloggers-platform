import {authModel} from "./authModel";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../users/repositories/usersRepository";

export const AuthService = {

    async authUser (data: authModel) {
        const user = await UsersRepository.findByLoginOrEmail(data.loginOrEmail , data.loginOrEmail);

        if(!user) return null;

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) return null;

        return user;
    },

    async meUser(id:string) {
        const user = await UsersRepository.getUserByID(id);

        if (!user) {
            return null
        }

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }

}
