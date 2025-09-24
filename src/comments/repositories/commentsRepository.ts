import { commentsCollection } from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import { commentModel } from "../differentModels/commentsModel";
import { paginationQuery } from "../../paginationEndpoints/paginationQuery";

export const commentsRepository = {
    async getCommentsById(id: string) {
        return commentsCollection.findOne({ _id: new ObjectId(id) });
    },

    async createComment(postId: string, data: string, userData: { id: string; userLogin: string }) {
        const comment: commentModel = {
            content: data,
            postId: postId,
            commentatorInfo: {
                userId: userData.id,
                userLogin: userData.userLogin,
            },
            createdAt: new Date().toISOString(),
        };

        const result = await commentsCollection.insertOne(comment);
        return commentsCollection.findOne({ _id: result.insertedId });
    },

    async getAllCommentsForPost(postId: string, query: paginationQuery) {
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortDirection = query.sortDirection === "asc" ? 1 : -1;
        const filter = { postId };

        const totalCount = await commentsCollection.countDocuments(filter);

        const items = await commentsCollection
            .find(filter)
            .sort({ createdAt: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return {
            totalCount,
            items, // ⚡ сырые Mongo-доки
            page: pageNumber,
            pageSize,
        };
    },

    async updateComment(id: string, content: string) {
        const updateResult = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        );
        return updateResult.matchedCount === 1;
    },

    async deleteComment(id: string) {
        const deleteResult = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
        return deleteResult.deletedCount === 1;
    },

    async deleteAllComments() {
        const deleteResult = await commentsCollection.deleteMany({});
        return deleteResult.deletedCount;
    },
};