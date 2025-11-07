import { Request, Response } from 'express';
import {BlogsService} from "../services/blogService";
import {BlogsQueryRepository} from "../repositories/blogsQueryRepository";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../types/requestTypes";
import {blogInputModel} from "../differentModels/blogInputModel";
import {blogViewModel} from "../differentModels/blogViewModel";
import {postInputModel} from "../../posts/differentModels/postInputModel";
import {postViewModel} from "../../posts/differentModels/postViewModel";
import {PostQueryRepository} from "../../posts/repositories/postQueryRepository";
import {WithId} from "mongodb";
import {blogDbModel} from "../differentModels/blogDbModel";
import {paginationQueryInputModel} from "../../posts/differentModels/paginationQueryInputModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {getPaginationFromQuery} from "../../posts/helpers/getPaginationFromQuery";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {inject, injectable} from "inversify";
import {JwtService} from "../../authorization/service/jwtService";
//TODO улучшить структуру папок
//TODO создать ObjectResult
//TODO прочитать и запонмит разницу между хешированием шифрованием и кодированием
//TODO прочитать и запонмит HTTP и HTTPS
@injectable()
export class BlogController {

    constructor(
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostQueryRepository) protected postQueryRepository: PostQueryRepository,
        @inject(JwtService) protected jwtService: JwtService,
    ) {}

    async createBlogHandler(req: RequestWithBody<blogInputModel>, res: Response ) {

        const createBlog:string | null = await this.blogsService.createBlog(req.body);

        const findBlog:blogViewModel | null = await this.blogsQueryRepository.getByIdBlog(createBlog);
        if(!findBlog) return res.sendStatus(404)

        res.status(201).send(findBlog)

    }
    //TODO вынести логику
    async createPostForBlogHandler(req: RequestWithParamsAndBody<{ id: string }, postInputModel>, res: Response ) {
        const createPostForBlog:string | null = await this.blogsService.createPostForBlog(req.params.id, req.body);
        if(!createPostForBlog) return res.sendStatus(404)

        const findPost:postViewModel | null = await this.postQueryRepository.findPostById(createPostForBlog);
        if(!findPost) return res.sendStatus(404)

        res.status(201).send(findPost)

    }

    async deleteBlogHandler(req: RequestWithParams<{ id: string }>, res: Response) {
        //TODO есть метод найди и удали
        const findBlog:WithId<blogDbModel> | null = await this.blogsService.findBlogById(req.params.id)
        if(!findBlog) return res.sendStatus(404)

        await this.blogsService.deleteBlogById(req.params.id);
        res.sendStatus(204)
    }

    async getAllBlogsHandler(req: RequestWithQuery<paginationQueryInputModel>, res: Response) {
        const pagination: paginationQueryOutputModel = getPaginationFromQuery(req.query)
        const findAllBlogs: paginationViewModel<blogViewModel> = await this.blogsQueryRepository.getAllBlogs(pagination)

        res.status(200).send(findAllBlogs);
    }

    async getBlogByIdHandler(req: RequestWithParams<{ id: string }>, res: Response) {
        const findBlogsByID:blogViewModel | null = await this.blogsQueryRepository.getByIdBlog(req.params.id)
        if(!findBlogsByID) return res.sendStatus(404)

        res.status(200).send(findBlogsByID)
    }

    async getPostsByBlogIdHandler(req: RequestWithParamsAndQuery<{ id: string } , paginationQueryInputModel>, res: Response ) {
        const blog:blogViewModel | null = await this.blogsQueryRepository.getByIdBlog(req.params.id);
        if (!blog)return res.sendStatus(404);
        let userId;
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1];
            userId = await this.jwtService.getUserIdByToken(token);
        }else{
            userId = undefined
        }
        const pagination:paginationQueryOutputModel = getPaginationFromQuery(req.query)
        const getAllPostsForBlog:paginationViewModel<postViewModel> = await this.blogsQueryRepository.getAllPostsForBlog(pagination ,userId, req.params.id );


        res.status(200).send(getAllPostsForBlog)
    }

    async updateBlogHandler(req: RequestWithParamsAndBody<{ id: string }, blogInputModel>, res: Response) {
        //TODO есть метод найди и обнови
        const findBlog:WithId<blogDbModel> | null = await this.blogsService.findBlogById(req.params.id)
        if(!findBlog) return res.sendStatus(404)

        await this.blogsService.updateBlog(req.params.id , req.body);
        res.sendStatus(204)
    }

}