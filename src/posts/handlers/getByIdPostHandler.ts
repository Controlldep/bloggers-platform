import { Request, Response } from 'express';
import {postQueryRepository} from "../repositories/postQueryRepository";
import {RequestWithParams} from "../../types/requestTypes";
import {postViewModel} from "../differentModels/postViewModel";
//TODO сделать  мидлевару на проверку айдишки и навесить ее везде
export async function getByIdPostHandler(req: RequestWithParams<{ id: string }>, res: Response<postViewModel>) {
    const findPostByID: postViewModel | null = await postQueryRepository.findPostById(req.params.id);

    if(!findPostByID) return res.sendStatus(404)

    res.status(200).send(findPostByID)

}