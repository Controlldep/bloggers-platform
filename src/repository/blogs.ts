import {blogsModel} from "../model/blogsModel";
import {blogsCollection, client} from "../db/mongoDb";
import { ObjectId } from "mongodb";
import {blogViewModel} from "../DTO/blogViewModel";


export const  blogsRepository = {
    async getAllBlogs() {
        const blogs = await blogsCollection.find({}).toArray();

        return blogs
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
        return result
    },

    async getByIdBlogs(id:string) {
        const findBlogs = await blogsCollection.findOne({ _id: new ObjectId(id) })
        if(!findBlogs) {
            return  null
        }
        return blogViewModel(findBlogs)
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