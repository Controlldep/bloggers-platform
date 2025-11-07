import {inject, injectable} from "inversify";
import {PostLikeRepositories} from "../repositories/postLikeRepositories";
import {PostRepository} from "../../posts/repositories/postRepository";
import {postLikeDbModel} from "../model/postLikeDbModel";
import {WithId} from "mongodb";
import {postDbModel} from "../../posts/differentModels/postDbModel";


@injectable()
export class PostLikeService {
    constructor(
        @inject(PostLikeRepositories) protected postLikeRepositories: PostLikeRepositories,
        @inject(PostRepository) protected postRepository:PostRepository
    ) {}

    async createPostLike(userId: string , post: WithId<postDbModel> , login: string  ) {

        const createLike:postLikeDbModel = {
            userId: userId,
            postId: post._id.toString(),
            login: login,
            addedAt: new Date().toISOString(),
            myStatus: "None"
        }
        await this.postLikeRepositories.createLike(createLike)
        return true
    }

    async checkStatus(userId: string , postId: string){
        const status = await this.postLikeRepositories.checkStatus(userId , postId);
        return status
    }

    async changeStatus(userId: string , post: WithId<postDbModel> , status: string) {

        const checkStatus = await  this.postLikeRepositories.checkStatus(userId, post._id.toString())
        if(!checkStatus) return null
        if(checkStatus!.myStatus === status) return null

        if (checkStatus!.myStatus === "Like" && status === "Dislike") {
            post.extendedLikesInfo.likesCount -= 1;
            post.extendedLikesInfo.dislikesCount += 1;
        } else if (checkStatus!.myStatus === "Dislike" && status === "Like") {
            post.extendedLikesInfo.likesCount += 1;
            post.extendedLikesInfo.dislikesCount -= 1;
        }

        else if (status === "None") {
            if (checkStatus.myStatus === "Like") {
                post.extendedLikesInfo.likesCount -= 1;
            } else if (checkStatus.myStatus === "Dislike") {
                post.extendedLikesInfo.dislikesCount -= 1;
            }
        }

        else if (status === "Like") {
            post.extendedLikesInfo.likesCount += 1;
        } else if (status === "Dislike") {
            post.extendedLikesInfo.dislikesCount += 1;
        }
        console.log("Updated extendedLikesInfo:", post.extendedLikesInfo);

        await this.postLikeRepositories.updateStatus(userId , post._id.toString() , status)
        await this.postRepository.updateLikesInfo(post)

    }
}