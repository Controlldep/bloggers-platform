import { Request, Response } from "express";
import {commentsService} from "../../comments/service/commentsService";
import {postQueryRepository} from "../repositories/postQueryRepository";


export const getCommentsByPostHandler = async (req: Request, res: Response) => {
    const postId = req.params.id;

    const post = await postQueryRepository.getPostByID(postId);
    if (!post) {
        return res.sendStatus(404);
    }

    const comments = await commentsService.getAllCommentsForPost(postId, req.query);

    return res.status(200).json(comments);
};