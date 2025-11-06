import {inject, injectable} from "inversify";
import {LikeCommentsRepository} from "../repositories/likeCommentsRepository";
import {WithId} from "mongodb";
import {commentDbModel} from "../../comments/differentModels/commentsModel";
import {CommentsRepository} from "../../comments/repositories/commentsRepository";


@injectable()
export class LikeService {

    constructor(
        @inject(LikeCommentsRepository) protected likeCommentsRepository: LikeCommentsRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {
    }

    async checkStatus(id: string , commentID: string) {
        const status = await this.likeCommentsRepository.checkStatus(id , commentID);
        return status
    }

//TODO придумать как сделать это более красиво
    async changeStatus(userId: string , comment: WithId<commentDbModel> , status: string) {
        const checkStatus = await  this.likeCommentsRepository.checkStatus(userId, comment._id.toString())
        if(!checkStatus) return null
        if(checkStatus!.myStatus === status) return null

        if (checkStatus!.myStatus === "Like" && status === "Dislike") {
            comment.likesInfo.likesCount -= 1;
            comment.likesInfo.dislikesCount += 1;
        } else if (checkStatus!.myStatus === "Dislike" && status === "Like") {
            comment.likesInfo.likesCount += 1;
            comment.likesInfo.dislikesCount -= 1;
        }

        else if (status === "None") {
            if (checkStatus.myStatus === "Like") {
                comment.likesInfo.likesCount -= 1;
            } else if (checkStatus.myStatus === "Dislike") {
                comment.likesInfo.dislikesCount -= 1;
            }
        }

        else if (status === "Like") {
            comment.likesInfo.likesCount += 1;
        } else if (status === "Dislike") {
            comment.likesInfo.dislikesCount += 1;
        }

        await this.likeCommentsRepository.updateStatus(userId , comment._id.toString() , status)
        await this.commentsRepository.updateLikesInfo(comment)
    }
}