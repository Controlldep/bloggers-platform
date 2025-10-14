import { Request, Response } from "express";
import {commentsService} from "../../comments/service/commentsService";
import {UsersService} from "../../users/service/userService";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {RequestWithParamsAndBody} from "../../types/requestTypes";
import {postViewModel} from "../differentModels/postViewModel";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";
import {commentsQueryRepository} from "../../comments/repositories/commentsQueryRepository";
import {commentViewModel} from "../../comments/differentModels/commentViewModel";

export const createCommentForPostHandler = async (req: RequestWithParamsAndBody<{id: string}, {content: string}>, res: Response) => {
    const userId:string = req.userId!;

    const findPostInDb:postViewModel | null = await postQueryRepository.findPostById(req.params.id);
    if (!findPostInDb) return res.sendStatus(404);

    const findUserInDb:WithId<userModel> | null = await UsersService.findUserById(userId);
    if (!findUserInDb) return res.sendStatus(401);

    const createNewComment: string | null = await commentsService.createComment(req.params.id, req.body.content, userId, findUserInDb.login);
    if(!createNewComment) return res.sendStatus(500);

    const findCommentInDb:commentViewModel | null = await commentsQueryRepository.getCommentsById(createNewComment)

    return res.status(201).json(findCommentInDb);
};