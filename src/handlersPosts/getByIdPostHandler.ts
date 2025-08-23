import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";
import {postModel} from "../model/postModel";

export function getByIdPostHandler(req: Request, res: Response) {
    const findByIdPost:postModel | undefined = postsRepository.getByIdPost(req.params.id)
    if(findByIdPost) {
        res.status(200).send(findByIdPost)
    }else {
        res.sendStatus(404)
    }
}