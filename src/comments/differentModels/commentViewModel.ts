import {commentModel} from "./commentsModel";
import { WithId } from "mongodb";
export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
};

export const mapCommentToViewModel = (comment: WithId<commentModel>): CommentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
});