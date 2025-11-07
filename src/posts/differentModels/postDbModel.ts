
export type postDbModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
    blogName: string,
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
    }
}