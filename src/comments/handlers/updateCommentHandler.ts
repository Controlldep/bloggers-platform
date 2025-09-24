import { Request, Response } from "express";
import {commentsService} from "../service/commentsService";


export const updateCommentHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

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

    if (!content || content.length < 20 || content.length > 300) {
        return res.status(400).json({
            errorsMessages: [
                { message: "Content length must be 20-300 characters", field: "content" },
            ],
        });
    }

    const isUpdated = await commentsService.updateComment(id, content);
    if (!isUpdated) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
};
