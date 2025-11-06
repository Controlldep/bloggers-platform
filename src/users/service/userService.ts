import {UsersRepository} from "../repositories/usersRepository";
import bcrypt from 'bcrypt'
import {paginationQuery} from "../differentModels/paginationQuery";
import {userInputModel} from "../differentModels/userInputModel";
import {userModel} from "../differentModels/userModels";
import {userViewModel} from "../differentModels/userViewModel";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService  {

    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {}

    async getUsers(query: paginationQuery){
        const getUsers = await this.usersRepository.getUsers(query);

        return getUsers
    }

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

        const createdUser = await this.usersRepository.createUser(userForDb);
        return createdUser ? userViewModel(createdUser) : null;
    }

    async deleteUser(id: string) {
        const deleted = await this.usersRepository.deleteUser(id);

        return deleted;
    }

    async findUserById(id:string) {
        const findUser = await this.usersRepository.getUserByID(id);
        if(!findUser)return null

        return findUser;
    }
//TODO опя косяк за мной замечен
    async findUserByEmail(email:string) {
        const findUser = await this.usersRepository.findByLoginOrEmail(undefined , email);
        if(!findUser) return null

        return findUser;
    }
}