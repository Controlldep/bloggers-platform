import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";
import {postModel} from "../model/postModel";

export function updatePostHandler(req: Request, res: Response) {
    const updatePost:postModel | undefined = postsRepository.updatePost(req.params.id , req.body)
    if(updatePost) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }
}