import {PostRepository} from "../repositories/postRepository";
import {postDbModel} from "../differentModels/postDbModel";
import {BlogsRepository} from "../../blogs/repositories/blogsRepository";
import {postInputModel} from "../differentModels/postInputModel";
import {blogDbModel} from "../../blogs/differentModels/blogDbModel";
import {WithId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {

    constructor(
        @inject(PostRepository) protected postRepository: PostRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    ) {}

    async createPost(post: postInputModel):Promise<string | null> {
        const findBlog:WithId<blogDbModel> | null= await this.blogsRepository.getBlogById(post.blogId);
        if(!findBlog) return null;

        const createPost: postDbModel = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: findBlog._id.toString(),
            createdAt: new Date().toISOString(),
            blogName: findBlog.name,
        };

        const saveInDbPost: string = await this.postRepository.createPost(createPost);
        return saveInDbPost;
    }

    async updatePost(id: string, post: postInputModel):Promise<postDbModel | null> {
        const findBlog:WithId<blogDbModel> | null = await this.blogsRepository.getBlogById(post.blogId);

        if (!findBlog) return null;

        const updatePost:postDbModel | null = await this.postRepository.updatePost(id, post , findBlog);

        return updatePost;
    }

    async deletePost(id:string):Promise<boolean> {
        const deletePost:boolean = await this.postRepository.deletePost(id);

        return deletePost;
    }

}
