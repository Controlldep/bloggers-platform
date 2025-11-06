import {injectable} from "inversify";
import {LikesCollection} from "../../db/mongoDb";
import {likeDbModel} from "../model/likeDbModel";


@injectable()
export class LikeCommentsRepository {
    async createLikeComment(likeModel:likeDbModel) {
        await LikesCollection.create(likeModel);
    }

    async checkStatus(id: string , commentID: string) {
        const checkStatus = await LikesCollection.findOne({userId: id , commentId:commentID})
        return checkStatus
    }

    async updateStatus(userId: string , commentId: string , status: string) {
         await LikesCollection.findOneAndUpdate(
            { userId: userId, commentId: commentId },
            { $set: { myStatus: status } },
            { returnDocument: 'after' }
        );
    }

}