
import {postRepository} from "../repositories/postRepository";
import {postModel} from "../differentModels/postModel";

import {blogsRepository} from "../../blogs/repositories/blogsRepository";


export const  postsService = {

    async createPost(post: postModel) {
        const findBlog= await blogsRepository.getBlogById(post.blogId);
        if(!findBlog) return null;

        const result = await postRepository.createPost(post, findBlog);
        return result;
    },

    async updatePost(id: string, post: postModel) {
        const findBlog = await blogsRepository.getBlogById(post.blogId);

        if (!findBlog) return null;

        const result = await postRepository.updatePost(id, post , findBlog);

        if (!result) return null;

        return result;
    },

    async deletePost(id:string) {
        const deletePost = await postRepository.deletePost(id);

        return deletePost;
    },

}
