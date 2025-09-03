import {blogsModel} from "../model/blogsModel";
import {blogsCollection, client} from "../db/mongoDb";
import { ObjectId } from "mongodb";


export const  blogsRepository = {
    async getAllBlogs() {
        const blogs = await blogsCollection.find({}).toArray();

        return blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }));
    },

    async createBlogs(blogs:blogsModel) {
        const blog:blogsModel = {
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,

        }
        const result = await blogsCollection.insertOne(blog)
        return {
            id: result.insertedId.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    },

    async getByIdBlogs(id:string) {
        const findBlogs = await blogsCollection.findOne({ _id: new ObjectId(id) })
        if(!findBlogs) {
            return  null
        }
        return {
            id: findBlogs._id.toString(),
            name: findBlogs.name,
            description: findBlogs.description,
            websiteUrl: findBlogs.websiteUrl,
            createdAt: findBlogs.createdAt,
            isMembership: findBlogs.isMembership,
        };
    },

    async updateBlog(id: string, data: Partial<blogsModel>)  {
        let result = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )
        return result.matchedCount === 1;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteBlog.deletedCount === 1;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({})
        return deletedAll.deletedCount;
    }
}