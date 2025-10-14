import { Request, Response } from 'express';
import {postsService} from "../service/postService";
import {RequestWithParamsAndBody} from "../../types/requestTypes";
import {postInputModel} from "../differentModels/postInputModel";
import {postDbModel} from "../differentModels/postDbModel";

export async function updatePostHandler(req: RequestWithParamsAndBody<{ id: string }, postInputModel>, res: Response) {
    const updatePost:postDbModel | null = await postsService.updatePost(req.params.id , req.body);

    if(!updatePost) return res.sendStatus(404)

    res.sendStatus(204)

}