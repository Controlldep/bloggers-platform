import { Router } from "express";
import {authAccessMiddleware} from "../../authorization/middleware/authAccessMiddleware";
import {getCommentByIdHandler} from "../handlers/getCommentsByIdHandler";
import {updateCommentHandler} from "../handlers/updateCommentHandler";
import {deleteCommentHandler} from "../handlers/deleteCommentHandler";

export const commentsRouter = Router();

commentsRouter
    .get("/comments/:id", getCommentByIdHandler)
    .put("/comments/:id", authAccessMiddleware, updateCommentHandler)
    .delete("/comments/:id", authAccessMiddleware, deleteCommentHandler)