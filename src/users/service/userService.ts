import {UsersRepository} from "../repositories/usersRepository";
import bcrypt from 'bcrypt'
import {paginationQuery} from "../differentModels/paginationQuery";
import {userInputModel} from "../differentModels/userInputModel";
import {userModel} from "../differentModels/userModels";
import {userViewModel} from "../differentModels/userViewModel";

export const UsersService = {

    async getUsers(query: paginationQuery){
        const getUsers = await UsersRepository.getUsers(query);

        return getUsers
    },

    async createUser(user: userInputModel) {

        const passwordHash = await bcrypt.hash(user.password, 10);

        const userForDb: userModel = {
            login: user.login,
            email: user.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            confirmationCode: null,
            expirationDate: null,
            isConfirmed: true
        };

        const createdUser = await UsersRepository.createUser(userForDb);
        return createdUser ? userViewModel(createdUser) : null;
    },

    async deleteUser(id: string) {
        const deleted = await UsersRepository.deleteUser(id);

        return deleted;
    },

    async findUserById(id:string) {
        const findUser = await UsersRepository.getUserByID(id);

        if(!findUser) {
            return null
        }

        return findUser;
    }
}