import { Router } from "express";
import {authAccessMiddleware} from "../../authorization/middleware/authAccessMiddleware";
import {getCommentByIdHandler} from "../handlers/getCommentsByIdHandler";
import {updateCommentHandler} from "../handlers/updateCommentHandler";
import {deleteCommentHandler} from "../handlers/deleteCommentHandler";
import {commentsValidation} from "../../posts/validation/commentsValidation";

export const commentsRouter = Router();

commentsRouter
    .get("/comments/:id", getCommentByIdHandler)
    .put("/comments/:id", authAccessMiddleware, commentsValidation, updateCommentHandler)
    .delete("/comments/:id", authAccessMiddleware, deleteCommentHandler)