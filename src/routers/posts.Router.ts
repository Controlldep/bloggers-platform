import {Router} from "express";
import {getAllPostsHandler} from "../handlersPosts/getAllPostsHandler";
import {createPostHandler} from "../handlersPosts/createPostHandler";
import {getByIdPostHandler} from "../handlersPosts/getByIdPostHandler";
import {updatePostHandler} from "../handlersPosts/updatePostHandler";
import {deletePostHandler} from "../handlersPosts/deletePostHandler";
import {postInputValidation} from "../middleware/PostsMiddleware/postsMiddlewareValidation";
import {baseAuthorization} from "../Authorization/baseAuthorization";
import {deleteAll} from "../handlersPosts/deleteAllPost";


export const postsRouter = Router();

postsRouter
    .get('/posts' , getAllPostsHandler)
    .post('/posts' , baseAuthorization ,createPostHandler, postInputValidation )
    .get('/posts/:id' , getByIdPostHandler)
    .put('/posts/:id' ,baseAuthorization,updatePostHandler, postInputValidation)
    .delete('/posts/:id' ,baseAuthorization, deletePostHandler)
    .delete('/testing/all-data' , deleteAll)