import  {Router} from "express";
import {getAllBlogsHandler} from "../handlerBlogs/getAllBlogsHandler";
import {createBlogHandler} from "../handlerBlogs/createBlogHandler";
import {getByIdBlogHandler} from "../handlerBlogs/getByIdBlogHandler";
import {updateBlogHandler} from "../handlerBlogs/updateBlogHandler";
import {deleteBlogHandler} from "../handlerBlogs/deleteBlogHandler";
import {blogsInputValidation} from "../middleware/blogsMiddleware/blogsMiddlewareValidation";
import {baseAuthorization} from "../Authorization/baseAuthorization";
import {deleteAll} from "../handlerBlogs/deleteAllBlogs";


export const blogsRouter = Router();
blogsRouter
    .get('/blogs' , getAllBlogsHandler)
    .post('/blogs' ,baseAuthorization, createBlogHandler , blogsInputValidation)
    .get('/blogs/:id' , getByIdBlogHandler)
    .put('/blogs/:id' ,baseAuthorization ,updateBlogHandler, blogsInputValidation)
    .delete('/blogs/:id' ,baseAuthorization, deleteBlogHandler)
    .delete('testing/all-data' , deleteAll)

