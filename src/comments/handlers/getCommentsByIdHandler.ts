import { Request, Response } from "express";
import {RequestWithParams} from "../../types/requestTypes";
import {commentsQueryRepository} from "../repositories/commentsQueryRepository";
import {commentViewModel} from "../differentModels/commentViewModel";

export const getCommentByIdHandler = async (req: RequestWithParams<{ id: string }>, res: Response<commentViewModel | null>) => {
    const comment:commentViewModel | null = await commentsQueryRepository.getCommentsById(req.params.id);
    if (!comment) return res.sendStatus(404);

    return res.status(200).json(comment);
};