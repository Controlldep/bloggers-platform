import {paginationQuery} from "../differentModels/paginationQuery";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {userViewModel} from "../differentModels/userViewModel";
import {userModel} from "../differentModels/userModels";
import {usersCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";

export const UsersRepository = {

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

        const totalCount = await usersCollection.countDocuments(filter);

        const items = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();


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
    },

    async createUser(user: userModel) {
        const created = await usersCollection.insertOne(user);
        return usersCollection.findOne({_id: created.insertedId});
    },

    async deleteUser(id: string) {

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const deleteBlog = await usersCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async findByLoginOrEmail(login?: string, email?: string) {
        const filter: any = { $or: [] };

        if (login) filter.$or.push({ login });
        if (email) filter.$or.push({ email });

        if (filter.$or.length === 0) return null;

        return usersCollection.findOne(filter);
    },

    async findUserByConfirmationCode(code: string) {
        return usersCollection.findOne({confirmationCode: code})
    },

    async deleteAll() {
        const deletedAll = await usersCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

    async getUserByID(id: string):Promise<WithId<userModel> | null >{
        const findUser:WithId<userModel> | null = await usersCollection.findOne({_id: new ObjectId(id)});

        return findUser;
    },

    async verifyUser(userId: ObjectId) {
        return usersCollection.updateOne(
            {_id: userId},
            {$set: {isConfirmed: true, confirmationCode: null, expirationDate: null}}
        );

    },
    async updateConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        return usersCollection.updateOne(
            { _id: userId },
            { $set: { confirmationCode: code, expirationDate: expirationDate } }
        );
    }
}