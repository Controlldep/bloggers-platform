import { Request, Response } from 'express';
import {postsService} from "../service/postService";

export async function getByIdPostHandler(req: Request, res: Response) {
    const findByIdPost = await postsService.getByIdPost(req.params.id);

    if(findByIdPost) {
        res.status(200).send(findByIdPost)
    }else {
        res.sendStatus(404)
    }

}