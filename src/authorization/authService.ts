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

}
