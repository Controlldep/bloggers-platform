import { Request, Response } from "express";
import {commentsService} from "../service/commentsService";


export const deleteCommentHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) {
        return res.sendStatus(401);
    }

    const comment = await commentsService.getCommentsById(id);
    if (!comment) {
        return res.sendStatus(404);
    }

    if (comment.commentatorInfo.userId !== userId) {
        return res.sendStatus(403);
    }

    const isDeleted = await commentsService.deleteComment(id);
    if (!isDeleted) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
};