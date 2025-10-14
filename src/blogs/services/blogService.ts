import {blogsRepository} from "../repositories/blogsRepository";
import {blogDbModel} from "../differentModels/blogDbModel";
import {blogInputModel} from "../differentModels/blogInputModel";
import { WithId} from "mongodb";
import {postDbModel} from "../../posts/differentModels/postDbModel";
import {postRepository} from "../../posts/repositories/postRepository";


export const  blogsService = {
    async findBlogById(id: string):Promise<WithId<blogDbModel> | null> {
        const findBlogInDb:WithId<blogDbModel> | null = await blogsRepository.getBlogById(id)
        return findBlogInDb
    },

    async createBlog(blog: blogInputModel):Promise<string> {
        const createBlog:blogDbModel = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const saveBlogInDb:string | null = await blogsRepository.createBlog(createBlog);

        return saveBlogInDb;
    },

    async createPostForBlog(id: string  , data:any):Promise<string | null> {
        const findBlog:WithId<blogDbModel> | null = await blogsRepository.getBlogById(id);
        if(!findBlog) return null;

        const createdAt:string = new Date().toISOString();
        const createPostForBlog:postDbModel= {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: id,
            createdAt,
            blogName: findBlog.name,
        };

        const createPost:string | null = await postRepository.createPost(createPostForBlog);

        return createPost;
    },

    async updateBlog(id: string, data: Partial<blogDbModel>):Promise<boolean>  {
        const updateBlog:boolean = await blogsRepository.updateBlog(id , data);

        return updateBlog;
    },

    async deleteBlogById(id:string):Promise<boolean> {
        const deleteBlog:boolean = await blogsRepository.deleteBlogById(id);

        return deleteBlog;
    },

}