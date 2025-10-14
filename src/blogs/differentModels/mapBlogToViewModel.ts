import {WithId} from "mongodb";
import {blogDbModel} from "./blogDbModel";

export const mapBlogToViewModel = (blog: WithId<blogDbModel>) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
})