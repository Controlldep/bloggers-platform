import { Request, Response } from 'express';
import {postsService} from "../service/postService";

export async function deletePostHandler(req: Request, res: Response) {
    const deletePost = await postsService.deletePost(req.params.id);

    if(deletePost) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}