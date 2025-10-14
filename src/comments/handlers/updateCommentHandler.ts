import { Request, Response } from "express";
import {commentsService} from "../service/commentsService";
import {RequestWithParamsAndBody} from "../../types/requestTypes";
import {commentDbModel} from "../differentModels/commentsModel";


export const updateCommentHandler = async (req: RequestWithParamsAndBody<{ id: string }, { content: string }>, res: Response) => {
    const comment:commentDbModel|null = await commentsService.getCommentById(req.params.id);
    if (!comment) return res.sendStatus(404);

    if (comment.commentatorInfo.userId !== req.userId) return res.sendStatus(403);

    const isUpdated:boolean = await commentsService.updateComment(req.params.id, req.body.content);
    if (!isUpdated) return res.sendStatus(500);

    return res.sendStatus(204);
};
