import {paginationQuery} from "../differentModels/paginationQuery";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {userViewModel} from "../differentModels/userViewModel";
import {userModel} from "../differentModels/userModels";
import {blogsCollection, usersCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const UsersRepository = {

    async getUsers(query: paginationQuery) {
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

        let filter: any = {};

        if (query.searchLoginTerm && query.searchEmailTerm) {
            filter.$or = [
                { login: { $regex: query.searchLoginTerm, $options: 'i' } },
                { email: { $regex: query.searchEmailTerm, $options: 'i' } }
            ];
        } else if (query.searchLoginTerm) {
            filter.login = { $regex: query.searchLoginTerm, $options: 'i' };
        } else if (query.searchEmailTerm) {
            filter.email = { $regex: query.searchEmailTerm, $options: 'i' };
        }

        const totalCount = await usersCollection.countDocuments(filter);

        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
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
        return usersCollection.findOne({ _id: created.insertedId });
    },

    async deleteUser(id: string) {

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const deleteBlog = await usersCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async findByLoginOrEmail(login: string , email: string) {
        return usersCollection.findOne({
            $or: [{ login: login }, { email: email }]
        });
    },

    async deleteAll() {
        const deletedAll = await usersCollection.deleteMany({});

        return deletedAll.deletedCount;
    }

}