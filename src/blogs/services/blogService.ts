import {blogsRepository} from "../repositories/blogsRepository";
import {blogModel} from "../differentModels/blogModel";


export const  blogsService = {
    async createBlog(blogs: blogModel) {
        const createBlog = await blogsRepository.createBlog(blogs);

        if (!createBlog) return null;

        return createBlog;
    },

    async createPostForBlog(id: string  , data:any) {
        const createPost = await blogsRepository.createPostForBlog(id , data );

        if (!createPost) {
            return null
        }

        return createPost;
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