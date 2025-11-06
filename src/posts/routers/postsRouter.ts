import {Router} from "express";
import {postInputValidation} from "../validation/postValidation.";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {authAccessMiddleware} from "../../authorization/middleware/authAccessMiddleware";
import {commentsValidation} from "../validation/commentsValidation";
import {PostsController} from "../controllers/postsController";
import {container} from "../../compositionRoot/compositionRoot";
import {JwtService} from "../../authorization/service/jwtService";
import {UsersService} from "../../users/service/userService";

const jwtService = container.get(JwtService);
const usersService = container.get(UsersService);
const postsController = container.get(PostsController)

export const postsRouter:Router = Router();

postsRouter
    .get('/posts' , postsController.getAllPostsHandler.bind(postsController))
    .post('/posts' , baseAuthorization , postInputValidation , postsController.createPostHandler.bind(postsController))
    .get('/posts/:id' , postsController.getByIdPostHandler.bind(postsController))
    .put('/posts/:id' ,baseAuthorization, postInputValidation  , postsController.updatePostHandler.bind(postsController))
    .delete('/posts/:id' ,baseAuthorization, postsController.deletePostHandler.bind(postsController))
    .get('/posts/:id/comments' , postsController.getCommentsByPostHandler.bind(postsController))
    .post('/posts/:id/comments' , authAccessMiddleware(jwtService , usersService) , commentsValidation , postsController.createCommentForPostHandler.bind(postsController))
