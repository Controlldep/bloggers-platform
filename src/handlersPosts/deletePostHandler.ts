import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";

export async  function deletePostHandler(req: Request, res: Response) {
    const deletePost = await postsRepository.deletePost(req.params.id)
    if(deletePost) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}