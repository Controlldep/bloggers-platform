import { CommentsCollection } from "../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import { commentDbModel } from "../differentModels/commentsModel";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async getCommentById(id: string):Promise<WithId<commentDbModel>|null>  {
        return CommentsCollection.findOne({ _id: new ObjectId(id) });
    }

    async createComment(comment: commentDbModel):Promise<string>{
        const result:WithId<commentDbModel> = await CommentsCollection.create(comment);
        return result._id.toString();
    }

    async updateComment(id: string, content: string):Promise<boolean> {
        const updateResult:UpdateResult<commentDbModel> = await CommentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        );

        return updateResult.modifiedCount === 1;
    }

    async deleteComment(id: string):Promise<boolean> {
        const deleteResult:DeleteResult = await CommentsCollection.deleteOne({ _id: new ObjectId(id) });
        return deleteResult.deletedCount === 1;
    }

    async updateLikesInfo(comment:WithId<commentDbModel>) {
        await CommentsCollection.updateOne(
            { _id: comment._id },
            { $set: { likesInfo: comment.likesInfo } } )

         return true
    }

}