export type likeDbModel = {
    userId: string;
    commentId: string;
    myStatus: 'Like' | 'Dislike' | 'None';
};