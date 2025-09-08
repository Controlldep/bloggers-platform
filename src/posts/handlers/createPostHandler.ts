import { Request, Response } from 'express';
import {postInputValidation} from "../../middleware/postsMiddleware/postValidation.";
import {postsService} from "../service/postService";

export async function createPostHandler(req: Request, res: Response) {
    const errors = postInputValidation(req.body);

    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
        return;
    }

    const createPost = await postsService.createPost(req.body);

    if(createPost) {
        res.status(201).send(createPost)
    }else {
        res.sendStatus(400)
    }

}