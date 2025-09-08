import {postModel} from "../differentModels/postModel";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import {blogModel} from "../../blogs/differentModels/blogModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";

export const  postRepository = {

    async getAllPosts(query: paginationQuery) {
        const pageNumber = Number(query.pageNumber) || 1;
        const pageSize = Number(query.pageSize) || 10;
        const sortBy = query.sortBy || 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

        const totalCount = await postsCollection.countDocuments({});

        const items = await postsCollection
            .find({})
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedItems = items.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));

        return {
            totalCount,
            pageNumber,
            pageSize,
            items: mappedItems,
        };
    },

    async createPost(post: postModel , findBlogNameFromId: blogModel) {
        const createdAt = new Date().toISOString();

        const createPost: postModel = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt,
            blogName: findBlogNameFromId.name,
        };

        const result = await postsCollection.insertOne(createPost);
        const created = await postsCollection.findOne({ _id: result.insertedId });

        return created;
    },

    async getByIdPost(id:string) {
        const findPost = await postsCollection.findOne({ _id: new ObjectId(id) });

        return findPost;
    },

    async updatePost(id: string, post: postModel , findBlog: blogModel) {
        const result:postModel | null = await postsCollection.findOneAndUpdate(
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

        return result;
    },

    async deletePost(id:string) {
        const deletePost = await postsCollection.deleteOne({_id: new ObjectId(id)});

        return deletePost.deletedCount === 1;
    },

    async deleteAllPost() {
        const deleteAll = await postsCollection.deleteMany({});

        return deleteAll.deletedCount;
    }
}
