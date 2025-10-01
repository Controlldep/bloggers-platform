import {blogModel} from "../differentModels/blogModel";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import {postModel} from "../../posts/differentModels/postModel";


export const  blogsRepository = {
    async getBlogById(id:string) {
        const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});
        return findBlog;
    },

    async createBlog(blogs:blogModel) {
        const blog:blogModel = {
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,

        }

        const result = await blogsCollection.insertOne(blog);

        if (!result.insertedId) {
            return null;
        }

        return result.insertedId.toString();
    },

    async createPostForBlog(id:string , data:any) {
        const createdAt = new Date().toISOString();
        const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if(!findBlog) {
            return null
        }

        const createPostForBlog:postModel= {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: id,
            createdAt,
            blogName: findBlog.name,
        };

        const result = await postsCollection.insertOne(createPostForBlog);

        return result.insertedId.toString();
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        let updateBlog = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return updateBlog.matchedCount === 1;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

}