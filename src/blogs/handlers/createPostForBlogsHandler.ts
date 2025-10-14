import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";
import {postViewModel} from "../../posts/differentModels/postViewModel";
import {RequestWithParamsAndBody} from "../../types/requestTypes";
import {postInputModel} from "../../posts/differentModels/postInputModel";

export async function createPostForBlogHandler(req: RequestWithParamsAndBody<{ id: string }, postInputModel>, res: Response ) {
    const createPostForBlog:string | null = await blogsService.createPostForBlog(req.params.id, req.body);
    if(!createPostForBlog) return res.sendStatus(404)

    const findPost:postViewModel | null = await postQueryRepository.findPostById(createPostForBlog);
    if(!findPost) return res.sendStatus(404)

    res.status(201).send(findPost)

}