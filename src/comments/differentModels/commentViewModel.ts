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
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    };
};

export const mapCommentToViewModel = (
    comment: WithId<commentDbModel>,
    myStatus: string = "None"
): commentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus
    }
});