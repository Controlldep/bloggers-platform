import { Request, Response } from 'express';
import {postsService} from "../service/postService";


export async function updatePostHandler(req: Request, res: Response) {

    const updatePost= await postsService.updatePost(req.params.id , req.body);

    if(updatePost) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }

}