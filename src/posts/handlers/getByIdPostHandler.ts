import { Request, Response } from 'express';
import {postQueryRepository} from "../repositories/postQueryRepository";

export async function getByIdPostHandler(req: Request, res: Response) {
    const findPostByID = await postQueryRepository.getPostByID(req.params.id);

    if(findPostByID) {
        res.status(200).send(findPostByID)
    }else {
        res.sendStatus(404)
    }

}