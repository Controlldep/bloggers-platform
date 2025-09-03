import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";
import {postInputValidation} from "../middleware/PostsMiddleware/postsMiddlewareValidation";

export async function createPostHandler(req: Request, res: Response) {
    const errors = postInputValidation(req.body)
    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
        return;
    }
    const createPost = await postsRepository.createPost(req.body)
    if(createPost) {
        res.status(201).send(createPost)
    }else {
        res.sendStatus(400)
    }
}