export type commentModel = {
    content: string;
    postId: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
};