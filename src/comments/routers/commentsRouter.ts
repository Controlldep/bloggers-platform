import { Router } from "express";
import {authMiddleware} from "../../authorization/middleware/authMiddleware";
import {getCommentByIdHandler} from "../handlers/getCommentsByIdHandler";
import {updateCommentHandler} from "../handlers/updateCommentHandler";
import {deleteCommentHandler} from "../handlers/deleteCommentHandler";

export const commentsRouter = Router();

commentsRouter
    .get("/comments/:id", getCommentByIdHandler)
    .put("/comments/:id", authMiddleware, updateCommentHandler)
    .delete("/comments/:id", authMiddleware, deleteCommentHandler)