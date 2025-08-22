import  {Router} from "express";
import {getAllBlogsHandler} from "../handlerBlogs/getAllBlogsHandler";
import {createBlogHandler} from "../handlerBlogs/createBlogHandler";
import {getByIdBlogHandler} from "../handlerBlogs/getByIdBlogHandler";
import {updateBlogHandler} from "../handlerBlogs/updateBlogHandler";
import {deleteBlogHandler} from "../handlerBlogs/deleteBlogHandler";


export const blogsRouter = Router();

blogsRouter
    .get('/blogs' , getAllBlogsHandler)
    .post('/blogs' , createBlogHandler)
    .get('/blogs/:id' , getByIdBlogHandler)
    .put('/blogs/:id' , updateBlogHandler)
    .delete('/blogs/:id' , deleteBlogHandler)