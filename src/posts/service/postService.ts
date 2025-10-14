
import {postRepository} from "../repositories/postRepository";
import {postDbModel} from "../differentModels/postDbModel";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";
import {postInputModel} from "../differentModels/postInputModel";
import {blogDbModel} from "../../blogs/differentModels/blogDbModel";
import {WithId} from "mongodb";


export const  postsService = {

    async createPost(post: postInputModel):Promise<string | null> {
        const findBlog:WithId<blogDbModel> | null= await blogsRepository.getBlogById(post.blogId);
        if(!findBlog) return null;

        const createPost: postDbModel = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: findBlog._id.toString(),
            createdAt: new Date().toISOString(),
            blogName: findBlog.name,
        };

        const saveInDbPost: string = await postRepository.createPost(createPost);
        return saveInDbPost;
    },

    async updatePost(id: string, post: postInputModel):Promise<postDbModel | null> {
        const findBlog:WithId<blogDbModel> | null = await blogsRepository.getBlogById(post.blogId);

        if (!findBlog) return null;

        const updatePost:postDbModel | null = await postRepository.updatePost(id, post , findBlog);

        return updatePost;
    },

    async deletePost(id:string):Promise<boolean> {
        const deletePost:boolean = await postRepository.deletePost(id);

        return deletePost;
    },

}
