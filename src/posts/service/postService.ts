import {postViewModel} from "../differentModels/postViewModel";
import {postRepository} from "../repositories/postRepository";
import {postModel} from "../differentModels/postModel";
import {blogsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {blogModel} from "../../blogs/differentModels/blogModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";

export const  postsService = {

    async getAllPosts(query: paginationQuery) {
        const { totalCount, items, pageNumber, pageSize } = await postRepository.getAllPosts(query);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items,
        };
    },

    async createPost(post: postModel) {
        const findBlogNameFromId:blogModel | null = await blogsCollection.findOne({ _id: new ObjectId(post.blogId) });

        if (!findBlogNameFromId) return null;

        const result:WithId<postModel> | null = await postRepository.createPost(post, findBlogNameFromId);

        return postViewModel(result);
    },


    async getByIdPost(id:string) {
        const findPost = await postRepository.getByIdPost(id);

        if(!findPost) {
            return null
        }

        return postViewModel(findPost);
    },

    async updatePost(id: string, post: postModel) {
        const findBlog = await blogsCollection.findOne({ _id: new ObjectId(post.blogId) });

        if (!findBlog) return null;

        const result = await postRepository.updatePost(id, post , findBlog);

        if (!result) return null;

        return postViewModel(result)
    },

    async deletePost(id:string) {
        const deletePost = await postRepository.deletePost(id);

        return deletePost;
    },

    async deleteAllPost() {
        const deleteAll = await postRepository.deleteAllPost();

        return deleteAll;
    }
}
