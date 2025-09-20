import {blogViewModel} from "../differentModels/blogViewModel";
import {blogsRepository} from "../repositories/blogsRepository";
import {blogModel} from "../differentModels/blogModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";
import {postViewModel} from "../../posts/differentModels/postViewModel";
import {ObjectId, WithId} from "mongodb";

export const  blogsService = {

    async getAllBlogs(query:paginationQuery) {
        const blogs = await blogsRepository.getAllBlogs(query);

        return blogs;
    },

    async createBlog(blogs: blogModel) {
        const createBlog = await blogsRepository.createBlog(blogs);

        if (!createBlog) return null;

        return blogViewModel(createBlog);
    },

    async createPostForBlog(id: string  , data:any) {
        const createPost = await blogsRepository.createPostForBlog(id , data );

        if (!createPost) {
            return null
        }

        return postViewModel(createPost);
    },

    async getByIdBlog(id:string) {
        const findBlog = await blogsRepository.getByIdBlog(id);

        if (!findBlog) {
            return null
        }

        return blogViewModel(findBlog);
    },

    async getAllPostsForBlog(id: string, query: paginationQuery) {
        if (!ObjectId.isValid(id)) return null;

        const findBlog = await blogsRepository.getByIdBlog(id);

        if (!findBlog) return null;

        return await blogsRepository.getAllPostsForBlog(id, query);
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        let updateBlog = await blogsRepository.updateBlog(id , data);

        return updateBlog;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsRepository.deleteBlog(id);

        return deleteBlog;
    },

}