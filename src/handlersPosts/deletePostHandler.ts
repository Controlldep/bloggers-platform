import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";

export function deletePostHandler(req: Request, res: Response) {
    const deletePost = postsRepository.deletePost(req.params.id)
    if(deletePost) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}