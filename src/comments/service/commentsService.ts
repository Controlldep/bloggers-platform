import { commentsRepository } from "../repositories/commentsRepository";
import {commentDbModel} from "../differentModels/commentsModel";

export const commentsService = {

    async createComment(id: string, data: string,  userId: string , userLogin: string ):Promise<string | null> {
        const comment: commentDbModel = {
            content: data,
            postId: id,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            createdAt: new Date().toISOString(),
        };

        const createCommentInDb: string  = await commentsRepository.createComment(comment);
        if(!createCommentInDb) return null

        return createCommentInDb
    },

    async updateComment(id: string, data: string):Promise<boolean> {
        return commentsRepository.updateComment(id, data);
    },

    async deleteComment(id: string):Promise<boolean> {
        return commentsRepository.deleteComment(id);
    },

    async getCommentById(id:string):Promise<commentDbModel|null> {
        return commentsRepository.getCommentById(id)
    }
};