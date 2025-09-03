import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";
import {postModel} from "../model/postModel";
import {postInputValidation} from "../middleware/PostsMiddleware/postsMiddlewareValidation";

export async  function updatePostHandler(req: Request, res: Response) {
    const errors = postInputValidation(req.body)
    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
        return;
    }
    const updatePost= await postsRepository.updatePost(req.params.id , req.body)
    if(updatePost) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }
}