import {Router} from "express";
import {getAllPostsHandler} from "../handlersPosts/getAllPostsHandler";
import {createPostHandler} from "../handlersPosts/createPostHandler";
import {getByIdPostHandler} from "../handlersPosts/getByIdPostHandler";
import {updatePostHandler} from "../handlersPosts/updatePostHandler";
import {deletePostHandler} from "../handlersPosts/deletePostHandler";


export const postsRouter = Router();

postsRouter
    .get('/posts' , getAllPostsHandler)
    .post('/posts' , createPostHandler)
    .get('/posts/:id' , getByIdPostHandler)
    .put('/posts/:id' , updatePostHandler)
    .delete('/posts/:id' , deletePostHandler)