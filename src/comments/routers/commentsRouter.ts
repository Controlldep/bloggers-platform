import { Router } from "express";
import {authAccessMiddleware} from "../../authorization/middleware/authAccessMiddleware";
import {commentsValidation} from "../../posts/validation/commentsValidation";
import {CommentsController} from "../controllers/commentsController";
import {container} from "../../compositionRoot/compositionRoot";
import {JwtService} from "../../authorization/service/jwtService";
import {UsersService} from "../../users/service/userService";

const jwtService = container.get(JwtService);
const usersService = container.get(UsersService);
const commentsController = container.get(CommentsController)

export const commentsRouter:Router = Router();

commentsRouter
    .get("/comments/:id", commentsController.getCommentByIdHandler.bind(commentsController))
    .put("/comments/:id", authAccessMiddleware(jwtService , usersService), commentsValidation, commentsController.updateCommentHandler.bind(commentsController))
    .delete("/comments/:id", authAccessMiddleware(jwtService , usersService), commentsController.deleteCommentHandler.bind(commentsController))
    .put('/comments/:id/like-status', authAccessMiddleware(jwtService , usersService), commentsController.updateLikeStatus.bind(commentsController))