import {paginationQuery} from "../differentModels/paginationQuery";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {userViewModel} from "../differentModels/userViewModel";
import {userModel} from "../differentModels/userModels";
import {UsersCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository  {

    async getUsers(query: paginationQuery) {
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

        let filter: any = {};

        if (query.searchLoginTerm && query.searchEmailTerm) {
            filter.$or = [
                {login: {$regex: query.searchLoginTerm, $options: 'i'}},
                {email: {$regex: query.searchEmailTerm, $options: 'i'}}
            ];
        } else if (query.searchLoginTerm) {
            filter.login = {$regex: query.searchLoginTerm, $options: 'i'};
        } else if (query.searchEmailTerm) {
            filter.email = {$regex: query.searchEmailTerm, $options: 'i'};
        }

        const totalCount = await UsersCollection.countDocuments(filter);

        const items = await UsersCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);


        const mappedItems = items.map(user => (userViewModel(user)));
        const pagesCount = Math.ceil(totalCount / pageSize);

        type userViewModel = ReturnType<typeof userViewModel>;

        const result: paginationModel<userViewModel> = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedItems,
        };

        return result;
    }

    async createUser(user: userModel) {
        const created = await UsersCollection.create(user);
        return UsersCollection.findOne({_id: created._id});
    }

    async deleteUser(id: string) {

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const deleteBlog = await UsersCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    }

    async findByLoginOrEmail(login?: string, email?: string) {
        const filter: any = { $or: [] };

        if (login) filter.$or.push({ login });
        if (email) filter.$or.push({ email });

        if (filter.$or.length === 0) return null;

        return UsersCollection.findOne(filter);
    }

    async findUserByConfirmationCode(code: string) {
        return UsersCollection.findOne({confirmationCode: code})
    }

    async getUserByID(id: string):Promise<WithId<userModel> | null >{
        const findUser:WithId<userModel> | null = await UsersCollection.findOne({_id: new ObjectId(id)});

        return findUser;
    }

    async verifyUser(userId: ObjectId) {
        return UsersCollection.updateOne(
            {_id: userId},
            {$set: {isConfirmed: true, confirmationCode: null, expirationDate: null}}
        );

    }
    async updateConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        return UsersCollection.updateOne(
            { _id: userId },
            { $set: { confirmationCode: code, expirationDate: expirationDate } }
        );
    }

    async updatePassword(userId: ObjectId, passwordHash: string) {
        return UsersCollection.updateOne(
            { _id: userId },
            { $set: { password: passwordHash } }
        );
    }
}