import {blogViewModel} from "../differentModels/blogViewModel";
import {blogsRepository} from "../repositories/blogsRepository";
import {blogModel} from "../differentModels/blogModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";
import {postViewModel} from "../../posts/differentModels/postViewModel";



export const  blogsService = {

    async getAllBlogs(query:paginationQuery) {
        const blogs = await blogsRepository.getAllBlogs(query);

        return blogs
    },

    async createBlogs(blogs: blogModel) {
        const createBlog = await blogsRepository.createBlogs(blogs);

        return blogViewModel(createBlog);
    },

    async getByIdBlogs(id:string) {
        const findBlogs = await blogsRepository.getByIdBlogs(id);
        if (!findBlogs) {
            return null
        }
        return blogViewModel(findBlogs);
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
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
    },


    async createPostForBlogs(id: string  , data:any) {
        const findBlogs = await blogsRepository.getByIdBlogs(id);

        if(!findBlogs) {
            return null
        }

        const createPost = await blogsRepository.createPostForBlogs(id , data )

        return createPost
    },

    async getAllPostForBlogs(id: string, query: paginationQuery) {
        const findBlogs = await blogsRepository.getByIdBlogs(id);
        if (!findBlogs) return null;

        const { totalCount, items, pageNumber, pageSize } = await blogsRepository.getAllPostForBlogs(id, query);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items, // уже с id вместо _id
        };
    }
}