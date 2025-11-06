import {Request, Response} from "express";
import {CommentsService} from "../service/commentsService";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../types/requestTypes";
import {commentDbModel} from "../differentModels/commentsModel";
import {CommentsQueryRepository} from "../repositories/commentsQueryRepository";
import {inject, injectable} from "inversify";
import {WithId} from "mongodb";
import {LikeService} from "../../commentsLike/service/likeService";
import {JwtService} from "../../authorization/service/jwtService";
import {likeDbModel} from "../../commentsLike/model/likeDbModel";
import {LikeCommentsRepository} from "../../commentsLike/repositories/likeCommentsRepository";

@injectable()
export class CommentsController {

    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(LikeService) protected likeService: LikeService,
        @inject(LikeCommentsRepository) protected likeCommentsRepository: LikeCommentsRepository,
        @inject(JwtService) protected jwtService: JwtService
    ) {
    }
    async getCommentByIdHandler(req: RequestWithParams<{ id: string }>, res: Response) {
        let token;
        let userId;
        if(req.headers.authorization){
            token= req.headers.authorization.split(" ")[1];
            userId = await this.jwtService.getUserIdByToken(token);
        }else{
            userId = undefined
        }
        const comment = await this.commentsQueryRepository.getCommentsById(req.params.id , userId);
        if (!comment) return res.sendStatus(404);

        return res.status(200).json(comment);
    }

    //TODO вынести логику
    async deleteCommentHandler(req: RequestWithParams<{ id: string }>, res: Response) {
        const comment: WithId<commentDbModel> | null = await this.commentsService.getCommentById(req.params.id);
        if (!comment) return res.sendStatus(404);

        if (comment.commentatorInfo.userId !== req.userId) return res.sendStatus(403);

        const isDeleted: boolean = await this.commentsService.deleteComment(req.params.id);
        if (!isDeleted) return res.sendStatus(404);

        return res.sendStatus(204);
    }

    async updateCommentHandler(req: RequestWithParamsAndBody<{ id: string }, { content: string }>, res: Response) {
        const comment: WithId<commentDbModel> | null = await this.commentsService.getCommentById(req.params.id);
        if (!comment) return res.sendStatus(404);

        if (comment.commentatorInfo.userId !== req.userId) return res.sendStatus(403);

        const isUpdated: boolean = await this.commentsService.updateComment(req.params.id, req.body.content);
        if (!isUpdated) return res.sendStatus(500);

        return res.sendStatus(204);
    }

    async updateLikeStatus(req:RequestWithParamsAndBody<{ id: string }, {likeStatus: string }>, res: Response) {
        const userId: string = req.userId!;
        const {likeStatus} = req.body;
        //TODO вынести это отсюда в мидлуху
        if (!['Like', 'Dislike', "None"].includes(likeStatus)) {
            return res.status(400).json({
                errorsMessages: [{
                    message: 'Invalid status',
                    field: "likeStatus"
                }]
            });
        }

        const findComment: WithId<commentDbModel> | null = await this.commentsService.getCommentById(req.params.id);
        if (!findComment) return res.sendStatus(404);

        const findUserLikeSchema = await this.likeService.checkStatus(userId , findComment._id.toString())

        if(!findUserLikeSchema) {
            const newLike: likeDbModel = {
                userId: userId,
                commentId: findComment._id.toString(),
                myStatus: "None",
            };
            await this.likeCommentsRepository.createLikeComment(newLike)
        }

        await this.likeService.changeStatus(userId, findComment , likeStatus)
        return res.sendStatus(204)
    }
}