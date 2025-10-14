import { Request, Response } from 'express';
import {postsService} from "../service/postService";
import {RequestWithParams} from "../../types/requestTypes";

export async function deletePostHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const deletePost:boolean = await postsService.deletePost(req.params.id);

    if(!deletePost) return res.sendStatus(404);

    res.sendStatus(204)

}
