import {postModel} from "../differentModels/postModel";
import {postsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {blogModel} from "../../blogs/differentModels/blogModel";

export const  postRepository = {

    async getPostByID(id:string) {
        const findPost = await postsCollection.findOne({_id: new ObjectId(id)});
        return findPost;
    },

    async createPost(post: postModel , findBlog: WithId<blogModel>) {
        const createdAt = new Date().toISOString();
        const createPost: postModel = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: findBlog._id.toString(),
            createdAt,
            blogName: findBlog.name,
        };

        const result = await postsCollection.insertOne(createPost);
        return result.insertedId.toString();
    },


    async updatePost(id: string, post: postModel , findBlog: blogModel) {
        const updatePost:postModel | null = await postsCollection.findOneAndUpdate(
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

    async deletePost(id:string) {
        const deletePost = await postsCollection.deleteOne({_id: new ObjectId(id)});

        return deletePost.deletedCount === 1;
    },

    async deleteAllPost() {
        const deleteAll = await postsCollection.deleteMany({});

        return deleteAll.deletedCount;
    },

}
