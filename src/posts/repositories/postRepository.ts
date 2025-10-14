import {postDbModel} from "../differentModels/postDbModel";
import {postsCollection} from "../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, WithId} from "mongodb";
import {blogDbModel} from "../../blogs/differentModels/blogDbModel";
import {postInputModel} from "../differentModels/postInputModel";

export const  postRepository = {

    async createPost(post: postDbModel):Promise<string> {
        const result: InsertOneResult<postDbModel> = await postsCollection.insertOne(post);

        return result.insertedId.toString();
    },

    async updatePost(id: string, post: postInputModel , findBlog: blogDbModel):Promise<postDbModel | null> {
        const updatePost:postDbModel | null = await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: findBlog.name,
                },
            },
            { returnDocument: 'after' }
        );

        if (!updatePost) return null;

        return updatePost;
    },

    async deletePost(id:string):Promise<boolean> {
        const deletePost:DeleteResult = await postsCollection.deleteOne({_id: new ObjectId(id)});

        return deletePost.deletedCount === 1;
    },

    async deleteAllPost() {
        const deleteAll = await postsCollection.deleteMany({});

        return deleteAll.deletedCount;
    },

}
