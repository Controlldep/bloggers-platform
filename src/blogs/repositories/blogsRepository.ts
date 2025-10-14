import {blogDbModel} from "../differentModels/blogDbModel";
import {blogsCollection} from "../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";


export const  blogsRepository = {
    async getBlogById(id:string):Promise<WithId<blogDbModel> | null> {
        const findBlog:WithId<blogDbModel> | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return findBlog;
    },

    async createBlog(blog:blogDbModel):Promise<string> {
        const result:InsertOneResult<blogDbModel> = await blogsCollection.insertOne(blog);

        return result.insertedId.toString();
    },

    async updateBlog(id: string, data: Partial<blogDbModel>):Promise<boolean>  {
        const updateBlog:UpdateResult<blogDbModel> = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return updateBlog.matchedCount === 1;
    },

    async deleteBlogById(id:string):Promise<boolean> {
        const deleteBlog:DeleteResult = await blogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

}