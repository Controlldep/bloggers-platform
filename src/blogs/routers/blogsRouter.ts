import  {Router} from "express";
import {getAllBlogsHandler} from "../handlers/getAllBlogsHandler";
import {createBlogHandler} from "../handlers/createBlogHandler";
import {getByIdBlogHandler} from "../handlers/getByIdBlogHandler";
import {updateBlogHandler} from "../handlers/updateBlogHandler";
import {deleteBlogHandler} from "../handlers/deleteBlogHandler";
import {blogsInputValidation} from "../../middleware/blogsMiddleware/blogValidation";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {createPostForBlogHandler} from "../handlers/createPostForBlogsHandler";
import {getAllPostForBlogs} from "../handlers/getPostsForBlogHandler";
import {postInputValidation} from "../../middleware/postsMiddleware/postValidation.";


export const blogsRouter = Router();
blogsRouter
    .get('/blogs' , getAllBlogsHandler)
    .post('/blogs' ,baseAuthorization,blogsInputValidation, createBlogHandler)
    .get('/blogs/:id' , getByIdBlogHandler)
    .put('/blogs/:id' ,baseAuthorization ,blogsInputValidation ,updateBlogHandler)
    .delete('/blogs/:id' ,baseAuthorization, deleteBlogHandler)
    .get('/blogs/:id/posts' , getAllPostForBlogs)
    .post('/blogs/:id/posts' ,baseAuthorization , postInputValidation ,createPostForBlogHandler)
