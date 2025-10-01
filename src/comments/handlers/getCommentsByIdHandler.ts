import { Request, Response } from "express";
import {commentsService} from "../service/commentsService";

export const getCommentByIdHandler = async (req: Request, res: Response) => {
    const id = req.params.id;

    const comment = await commentsService.getCommentsById(id);

    if (!comment) {
        return res.sendStatus(404);
    }

    return res.status(200).json(comment);
};