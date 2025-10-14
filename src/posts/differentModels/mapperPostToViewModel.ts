import {WithId} from "mongodb";
import {postDbModel} from "./postDbModel";

export const  mapperPostToViewModel = (post: WithId<postDbModel>) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
})

