import { Request, Response } from "express";
import {CommentsService} from "../../comments/service/commentsService";
import {UsersService} from "../../users/service/userService";
import {PostQueryRepository} from "../repositories/postQueryRepository";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery, RequestWithQuery
} from "../../types/requestTypes";
import {postViewModel} from "../differentModels/postViewModel";
import {WithId} from "mongodb";
import {userModel} from "../../users/differentModels/userModels";
import {CommentsQueryRepository} from "../../comments/repositories/commentsQueryRepository";
import {commentViewModel} from "../../comments/differentModels/commentViewModel";
import {postInputModel} from "../differentModels/postInputModel";
import {PostsService} from "../service/postService";
import {paginationQueryInputModel} from "../differentModels/paginationQueryInputModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {getPaginationFromQuery} from "../helpers/getPaginationFromQuery";
import {paginationViewModel} from "../differentModels/paginationViewModel";
import {postDbModel} from "../differentModels/postDbModel";
import {inject, injectable} from "inversify";
import {JwtService} from "../../authorization/service/jwtService";


@injectable()
export class PostsController {

    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(PostQueryRepository) protected postQueryRepository: PostQueryRepository,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async createCommentForPostHandler(req: RequestWithParamsAndBody<{id: string}, {content: string}>, res: Response){
        const userId:string = req.userId!;

        const findPostInDb:postViewModel | null = await this.postQueryRepository.findPostById(req.params.id);
        if (!findPostInDb) return res.sendStatus(404);

        const findUserInDb:WithId<userModel> | null = await this.usersService.findUserById(userId);
        if (!findUserInDb) return res.sendStatus(401);

        const createNewComment: string | null = await this.commentsService.createComment(req.params.id, req.body.content, userId, findUserInDb.login);

        if(!createNewComment) return res.sendStatus(500);

        const findCommentInDb:commentViewModel | null = await this.commentsQueryRepository.getCommentsById(createNewComment , userId)

        return res.status(201).json(findCommentInDb);
    }

    async createPostHandler(req: RequestWithBody<postInputModel>, res: Response<postViewModel>) {
        const createPost: string | null = await this.postsService.createPost(req.body);
        if (!createPost) return res.sendStatus(400)

        const getPostById: postViewModel | null = await this.postQueryRepository.findPostById(createPost);
        if(!getPostById) return res.sendStatus(404)

        res.status(201).send(getPostById)
    }

    async deletePostHandler(req: RequestWithParams<{ id: string }>, res: Response) {
        const deletePost:boolean = await this.postsService.deletePost(req.params.id);

        if(!deletePost) return res.sendStatus(404);

        res.sendStatus(204)

    }

    async getCommentsByPostHandler(req: RequestWithParamsAndQuery<{ id: string } , paginationQueryInputModel>, res: Response) {
        const findPostInDb:postViewModel| null = await this.postQueryRepository.findPostById(req.params.id);
        if (!findPostInDb) return res.sendStatus(404);

        const token = req.headers.authorization?.split(" ")[1];
        const userId = token ? await this.jwtService.getUserIdByToken(token) : null;

        const pagination:paginationQueryOutputModel = getPaginationFromQuery(req.query)
        const comments:paginationViewModel<commentViewModel>  = await this.commentsQueryRepository.getAllCommentsForPost(pagination , req.params.id , userId);

        return res.status(200).json(comments);
    }

    async getAllPostsHandler(req: RequestWithQuery<paginationQueryInputModel>, res: Response) {
        const pagination: paginationQueryOutputModel = getPaginationFromQuery(req.query)
        const getPostsWithPagination: paginationViewModel<postViewModel> = await this.postQueryRepository.getAllPosts(pagination);

        res.status(200).send(getPostsWithPagination);
    }

    //TODO сделать  мидлевару на проверку айдишки и навесить ее везде
    async getByIdPostHandler(req: RequestWithParams<{ id: string }>, res: Response<postViewModel>) {
        const findPostByID: postViewModel | null = await this.postQueryRepository.findPostById(req.params.id);

        if(!findPostByID) return res.sendStatus(404)

        res.status(200).send(findPostByID)

    }

    async updatePostHandler(req: RequestWithParamsAndBody<{ id: string }, postInputModel>, res: Response) {
        const updatePost:postDbModel | null = await this.postsService.updatePost(req.params.id , req.body);

        if(!updatePost) return res.sendStatus(404)

        res.sendStatus(204)

    }

}