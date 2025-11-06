import { CommentsRepository } from "../repositories/commentsRepository";
import {commentDbModel} from "../differentModels/commentsModel";
import {inject, injectable} from "inversify";
import {WithId} from "mongodb";
import {LikeService} from "../../commentsLike/service/likeService";
import {LikeCommentsRepository} from "../../commentsLike/repositories/likeCommentsRepository";
import {likeDbModel} from "../../commentsLike/model/likeDbModel";

@injectable()
export class CommentsService {

    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(LikeService) protected likeService: LikeService,
        @inject(LikeCommentsRepository) protected likeCommentsRepository: LikeCommentsRepository,) {
    }

    async createComment(id: string, data: string,  userId: string , userLogin: string ):Promise<string | null> {
        const comment: commentDbModel = {
            content: data,
            postId: id,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            }
        };
        const createCommentInDb: string | null  = await this.commentsRepository.createComment(comment);

        if(!createCommentInDb) return null

        const newLike: likeDbModel = {
            userId: userId,
            commentId: createCommentInDb,
            myStatus: "None",
        };
        await this.likeCommentsRepository.createLikeComment(newLike)

        return createCommentInDb
    }

    async updateComment(id: string, data: string):Promise<boolean> {
        return this.commentsRepository.updateComment(id, data);
    }

    async deleteComment(id: string):Promise<boolean> {
        return this.commentsRepository.deleteComment(id);
    }

    async getCommentById(id:string):Promise<WithId<commentDbModel>|null> {
        return this.commentsRepository.getCommentById(id)
    }



}