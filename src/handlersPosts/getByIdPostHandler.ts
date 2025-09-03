import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";


export async function getByIdPostHandler(req: Request, res: Response) {
    const findByIdPost = await postsRepository.getByIdPost(req.params.id)
    if(findByIdPost) {
        res.status(200).send(findByIdPost)
    }else {
        res.sendStatus(404)
    }
}