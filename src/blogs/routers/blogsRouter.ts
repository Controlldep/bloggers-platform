import  {Router} from "express";
import {getAllBlogsHandler} from "../handlers/getAllBlogsHandler";
import {createBlogHandler} from "../handlers/createBlogHandler";
import {getByIdBlogHandler} from "../handlers/getByIdBlogHandler";
import {updateBlogHandler} from "../handlers/updateBlogHandler";
import {deleteBlogHandler} from "../handlers/deleteBlogHandler";
import {blogsInputValidation} from "../../middleware/blogsMiddleware/blogValidation";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {deleteAll} from "../handlers/deleteAllBlogs";
import {createPostForBlogHandler} from "../handlers/createPostForBlogsHandler";
import {getAllPostForBlogs} from "../handlers/getPostsForBlogHandler";


export const blogsRouter = Router();
blogsRouter
    .get('/blogs' , getAllBlogsHandler)
    .post('/blogs' ,baseAuthorization, createBlogHandler , blogsInputValidation)
    .get('/blogs/:id' , getByIdBlogHandler)
    .put('/blogs/:id' ,baseAuthorization ,updateBlogHandler, blogsInputValidation)
    .delete('/blogs/:id' ,baseAuthorization, deleteBlogHandler)
    .delete('testing/all-data' , deleteAll)
    .get('/blogs/:id/posts' , getAllPostForBlogs)
    .post('/blogs/:id/posts' ,baseAuthorization , createPostForBlogHandler , blogsInputValidation)
