import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";

export function createPostHandler(req: Request, res: Response) {
    const createPost = postsRepository.createPost(req.body)
    if(createPost) {
        res.status(201).send(createPost)
    }else {
        res.sendStatus(400)
    }
}