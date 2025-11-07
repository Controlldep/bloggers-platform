import {injectable} from "inversify";
import {postLikeDbModel} from "../model/postLikeDbModel";
import {LikesCollection, PostLikesCollection} from "../../db/mongoDb";



@injectable()
export class PostLikeRepositories {
    //Todo протипизирвоать
    async createLike(data: postLikeDbModel) {
        await PostLikesCollection.create(data)
        return true
    }

    async checkStatus(userId: string , postId: string) {
        const checkStatus = await PostLikesCollection.findOne({userId: userId , postId: postId})
        return checkStatus
    }

    async updateStatus(userId: string , postId: string , status: string) {
        await PostLikesCollection.findOneAndUpdate(
            { userId: userId, postId: postId},
            { $set: { myStatus: status } },
            { returnDocument: 'after' }
        );
    }

    async findAllLikesForPost(postId:string) {
        const result = await PostLikesCollection.find({ postId, myStatus: 'Like' })
            .sort({ addedAt: -1 })
            .select({
                addedAt: 1,
                userId: 1,
                login: 1,
                _id: 0 })
            .limit(3)

        return result
    }
}