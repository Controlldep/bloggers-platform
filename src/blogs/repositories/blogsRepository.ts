import {blogDbModel} from "../differentModels/blogDbModel";
import {BlogsCollection} from "../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async getBlogById(id:string):Promise<WithId<blogDbModel> | null> {
        const findBlog:WithId<blogDbModel> | null = await BlogsCollection.findOne({_id: new ObjectId(id)});
        return findBlog;
    }

    async createBlog(blog:blogDbModel):Promise<string> {
        const result:WithId<blogDbModel> = await BlogsCollection.create(blog);

        return result._id.toString();
    }

    async updateBlog(id: string, data: Partial<blogDbModel>):Promise<boolean>  {
        const updateBlog:UpdateResult<blogDbModel> = await BlogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return updateBlog.matchedCount === 1;
    }

    async deleteBlogById(id:string):Promise<boolean> {
        const deleteBlog:DeleteResult = await BlogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    }

}