import {commentDbModel} from "./commentsModel";
import { WithId } from "mongodb";
export type commentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
};

export const mapCommentToViewModel = (comment: WithId<commentDbModel>): commentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
});