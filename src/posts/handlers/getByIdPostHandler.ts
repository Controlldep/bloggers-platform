import { Request, Response } from 'express';
import {postsService} from "../service/postService";

export async function getByIdPostHandler(req: Request, res: Response) {
    const findPostByID = await postsService.getByIdPost(req.params.id);

    if(findPostByID) {
        res.status(200).send(findPostByID)
    }else {
        res.sendStatus(404)
    }

}