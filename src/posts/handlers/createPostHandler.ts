import {Request, Response} from 'express';
import {postsService} from "../service/postService";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {RequestWithBody} from "../../types/requestTypes";
import {postViewModel} from "../differentModels/postViewModel";
import {postInputModel} from "../differentModels/postInputModel";

export async function createPostHandler(req: RequestWithBody<postInputModel>, res: Response<postViewModel>) {
    const createPost: string | null = await postsService.createPost(req.body);
    if (!createPost) return res.sendStatus(400)

    const getPostById: postViewModel | null = await postQueryRepository.findPostById(createPost);
    if(!getPostById) return res.sendStatus(404)

    res.status(201).send(getPostById)
}