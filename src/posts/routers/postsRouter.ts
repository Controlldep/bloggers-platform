import {Router} from "express";
import {getAllPostsHandler} from "../handlers/getAllPostsHandler";
import {createPostHandler} from "../handlers/createPostHandler";
import {getByIdPostHandler} from "../handlers/getByIdPostHandler";
import {updatePostHandler} from "../handlers/updatePostHandler";
import {deletePostHandler} from "../handlers/deletePostHandler";
import {postInputValidation} from "../../middleware/postsMiddleware/postValidation.";
import {baseAuthorization} from "../../authorization/baseAuthorization";


export const postsRouter = Router();

postsRouter
    .get('/posts' , getAllPostsHandler)
    .post('/posts' , baseAuthorization , postInputValidation , createPostHandler)
    .get('/posts/:id' , getByIdPostHandler)
    .put('/posts/:id' ,baseAuthorization, postInputValidation  , updatePostHandler)
    .delete('/posts/:id' ,baseAuthorization, deletePostHandler)
