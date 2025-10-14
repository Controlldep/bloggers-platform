import { Request, Response } from "express";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {RequestWithParamsAndQuery} from "../../types/requestTypes";
import {postViewModel} from "../differentModels/postViewModel";
import {getPaginationFromQuery} from "../helpers/getPaginationFromQuery";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {paginationViewModel} from "../differentModels/paginationViewModel";
import {commentViewModel} from "../../comments/differentModels/commentViewModel";
import {commentsQueryRepository} from "../../comments/repositories/commentsQueryRepository";
import {paginationQueryInputModel} from "../differentModels/paginationQueryInputModel";

export const getCommentsByPostHandler = async (req: RequestWithParamsAndQuery<{ id: string } , paginationQueryInputModel>, res: Response) => {
    const findPostInDb:postViewModel| null = await postQueryRepository.findPostById(req.params.id);
    if (!findPostInDb) return res.sendStatus(404);

    const pagination:paginationQueryOutputModel = getPaginationFromQuery(req.query)
    const comments:paginationViewModel<commentViewModel>  = await commentsQueryRepository.getAllCommentsForPost(pagination , req.params.id);

    return res.status(200).json(comments);
};