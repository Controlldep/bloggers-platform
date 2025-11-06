import {BlogsRepository} from "../repositories/blogsRepository";
import {blogDbModel} from "../differentModels/blogDbModel";
import {blogInputModel} from "../differentModels/blogInputModel";
import { WithId} from "mongodb";
import {postDbModel} from "../../posts/differentModels/postDbModel";
import {PostRepository} from "../../posts/repositories/postRepository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostRepository) protected postRepository: PostRepository,
    ) {}

    async findBlogById(id: string):Promise<WithId<blogDbModel> | null> {
        const findBlogInDb:WithId<blogDbModel> | null = await this.blogsRepository.getBlogById(id)
        return findBlogInDb
    }

    async createBlog(blog: blogInputModel):Promise<string> {
        const createBlog:blogDbModel = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const saveBlogInDb:string | null = await this.blogsRepository.createBlog(createBlog);

        return saveBlogInDb;
    }

    async createPostForBlog(id: string  , data:any):Promise<string | null> {
        const findBlog:WithId<blogDbModel> | null = await this.blogsRepository.getBlogById(id);
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

        const createPost:string | null = await this.postRepository.createPost(createPostForBlog);

        return createPost;
    }

    async updateBlog(id: string, data: Partial<blogDbModel>):Promise<boolean>  {
        const updateBlog:boolean = await this.blogsRepository.updateBlog(id , data);

//TODO реализовать обновление данных во всех постах если меняется блог нейм
        return updateBlog;
    }

    async deleteBlogById(id:string):Promise<boolean> {
        const deleteBlog:boolean = await this.blogsRepository.deleteBlogById(id);

        return deleteBlog;
    }

}