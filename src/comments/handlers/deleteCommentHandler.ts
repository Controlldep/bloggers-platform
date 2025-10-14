import { Request, Response } from "express";
import {commentsService} from "../service/commentsService";
import {RequestWithParams} from "../../types/requestTypes";
import {commentDbModel} from "../differentModels/commentsModel";


export const deleteCommentHandler = async (req: RequestWithParams<{ id: string }>, res: Response) => {

    const comment:commentDbModel | null = await commentsService.getCommentById(req.params.id);
    if (!comment) return res.sendStatus(404);

    if (comment.commentatorInfo.userId !== req.userId) return res.sendStatus(403);

    const isDeleted:boolean = await commentsService.deleteComment(req.params.id);
    if (!isDeleted) return res.sendStatus(404);

    return res.sendStatus(204);
};