export function toCommentViewModel(dbComment: any) {
    return {
        id: dbComment._id.toString(),
        content: dbComment.content,
        commentatorInfo: {
            userId: dbComment.commentatorInfo.userId,
            userLogin: dbComment.commentatorInfo.userLogin,
        },
        createdAt: dbComment.createdAt,
    };
}