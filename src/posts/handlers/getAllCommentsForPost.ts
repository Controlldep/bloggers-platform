import { Request, Response } from "express";
import {commentsService} from "../../comments/service/commentsService";
import {postsService} from "../service/postService";
import { ObjectId } from "mongodb";


export const getCommentsByPostHandler = async (req: Request, res: Response) => {
    const postId = req.params.id;

    if (!ObjectId.isValid(postId)) {
        return res.sendStatus(404);
    }

    const post = await postsService.getByIdPost(postId);
    if (!post) {
        return res.sendStatus(404);
    }

    const comments = await commentsService.getAllCommentsForPost(postId, req.query);

    return res.status(200).json(comments);
};