
import {postModel} from "../model/postModel";
import {blogsCollection, postsCollection} from "../db/mongoDb";
import { ObjectId } from "mongodb";



export const  postsRepository = {
    async getAllPost() {
        const posts = await postsCollection.find({}).toArray();

        return posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));
    },

    async createPost(post: postModel) {
        const findBlogNameFromId = await blogsCollection.findOne({ _id: new ObjectId(post.blogId) })
        if (!findBlogNameFromId) {
            return null
        }

        const createdAt = new Date().toISOString()

        const createPost: postModel = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt,
            blogName: findBlogNameFromId.name,
        }

        const result = await postsCollection.insertOne(createPost)

        return {
            id: result.insertedId.toString(),
            title: createPost.title,
            shortDescription: createPost.shortDescription,
            content: createPost.content,
            blogId: createPost.blogId,
            blogName: createPost.blogName,
            createdAt: createPost.createdAt,
        }
    },

    async getByIdPost(id:string) {
        const findPost = await postsCollection.findOne({ _id: new ObjectId(id) })
        if (!findPost) {
            return null
        }
        return {
            id: findPost._id.toString(),
            title: findPost.title,
            shortDescription: findPost.shortDescription,
            content: findPost.content,
            blogId: findPost.blogId,
            blogName: findPost.blogName,
            createdAt: findPost.createdAt,
        }
    },
    async updatePost(id: string, post: postModel) {
        const findBlog = await blogsCollection.findOne({ _id: new ObjectId(post.blogId) });
        if (!findBlog) return null;

        const result = await postsCollection.findOneAndUpdate(
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

        if (!result) return null;

        return {
            id: result._id.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
        };
    },

    async deletePost(id:string) {
        const deletePost = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return deletePost.deletedCount === 1
    },
    async deleteAllPost() {
        const deleteAll = await postsCollection.deleteMany({})
        return deleteAll.deletedCount;
    }
}
