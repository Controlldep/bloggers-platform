import  {Router} from "express";
import {blogsInputValidation} from "../validation/blogValidation";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {postInputValidation} from "../../posts/validation/postValidation.";
import {BlogController} from "../controllers/blogController";
import {container} from "../../compositionRoot/compositionRoot";


const blogController = container.get(BlogController)

export const blogsRouter:Router = Router();

blogsRouter
    .get('/blogs' , blogController.getAllBlogsHandler.bind(blogController))
    .post('/blogs' ,baseAuthorization,blogsInputValidation, blogController.createBlogHandler.bind(blogController))
    .get('/blogs/:id' , blogController.getBlogByIdHandler.bind(blogController))
    .put('/blogs/:id' ,baseAuthorization ,blogsInputValidation , blogController.updateBlogHandler.bind(blogController))
    .delete('/blogs/:id' ,baseAuthorization, blogController.deleteBlogHandler.bind(blogController))
    .get('/blogs/:id/posts' , blogController.getPostsByBlogIdHandler.bind(blogController))
    .post('/blogs/:id/posts' ,baseAuthorization , postInputValidation , blogController.createPostForBlogHandler.bind(blogController))
