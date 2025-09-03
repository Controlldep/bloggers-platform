import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";

export async  function deleteAll(req: Request, res: Response) {
    await postsRepository.deleteAllPost()
    res.sendStatus(204)
}