export type postLikeDbModel = {
    userId: string;
    postId: string;
    addedAt: string;
    login: string;
    myStatus: 'Like' | 'Dislike' | 'None';
};