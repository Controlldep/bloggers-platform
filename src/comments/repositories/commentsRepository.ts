import { commentsCollection } from "../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import { commentDbModel } from "../differentModels/commentsModel";

export const commentsRepository = {
    async getCommentById(id: string):Promise<commentDbModel|null>  {
        return commentsCollection.findOne({ _id: new ObjectId(id) });
    },

    async createComment(comment: commentDbModel):Promise<string>{
        const result:InsertOneResult<commentDbModel> = await commentsCollection.insertOne(comment);

        return result.insertedId.toString();;
    },

    async updateComment(id: string, content: string):Promise<boolean> {
        const updateResult:UpdateResult<commentDbModel> = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        );

        return updateResult.modifiedCount === 1;
    },

    async deleteComment(id: string):Promise<boolean> {
        const deleteResult:DeleteResult = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
        return deleteResult.deletedCount === 1;
    },

    async deleteAllComments() {
        const deleteResult = await commentsCollection.deleteMany({});
        return deleteResult.deletedCount;
    },
};