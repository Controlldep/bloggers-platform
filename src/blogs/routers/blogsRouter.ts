import  {Router} from "express";
import {getAllBlogsHandler} from "../handlers/getAllBlogsHandler";
import {createBlogHandler} from "../handlers/createBlogHandler";
import {getBlogByIdHandler} from "../handlers/getBlogByIdHandler";
import {updateBlogHandler} from "../handlers/updateBlogHandler";
import {deleteBlogHandler} from "../handlers/deleteBlogHandler";
import {blogsInputValidation} from "../validation/blogValidation";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {createPostForBlogHandler} from "../handlers/createPostForBlogsHandler";
import {getPostsByBlogIdHandler} from "../handlers/getPostsForBlogHandler";
import {postInputValidation} from "../../posts/validation/postValidation.";


export const blogsRouter = Router();
blogsRouter
    .get('/blogs' , getAllBlogsHandler)
    .post('/blogs' ,baseAuthorization,blogsInputValidation, createBlogHandler)
    .get('/blogs/:id' , getBlogByIdHandler)
    .put('/blogs/:id' ,baseAuthorization ,blogsInputValidation ,updateBlogHandler)
    .delete('/blogs/:id' ,baseAuthorization, deleteBlogHandler)
    .get('/blogs/:id/posts' , getPostsByBlogIdHandler)
    .post('/blogs/:id/posts' ,baseAuthorization , postInputValidation ,createPostForBlogHandler)
