import {blogViewModel} from "../DTO/blogViewModel";
import {blogsRepository} from "../repository/blogs";
import {blogsModel} from "../model/blogsModel";


export const  blogsService = {

    async getAllBlogs() {
        const blogs = await blogsRepository.getAllBlogs();

        return blogs.map(blogViewModel);
    },

    async createBlogs(blogs: blogsModel) {
        const createBlog = blogsRepository.createBlogs(blogs);

        return blogViewModel(createBlog);
    },

    async getByIdBlogs(id:string) {
        const findBlogs = await blogsRepository.getByIdBlogs(id);

        if(!findBlogs) {
            return  null;
        }

        return blogViewModel(findBlogs);
    },

    async updateBlog(id: string, data: Partial<blogsModel>)  {
        let result = await blogsRepository.updateBlog(id , data);

        return result;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsRepository.deleteBlog(id);

        return deleteBlog;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsRepository.deleteAllBlogs();

        return deletedAll;
    }
}