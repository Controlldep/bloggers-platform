import { Request, Response } from 'express';
import {postsService} from "../service/postService";

export async function createPostHandler(req: Request, res: Response) {
    const createPost = await postsService.createPost(req.body);

    if(createPost) {
        res.status(201).send(createPost)
    }else {
        res.sendStatus(400)
    }

}