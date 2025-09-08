import { Request, Response } from 'express';
import {postsService} from "../service/postService";

export async  function deleteAll(req: Request, res: Response) {
    await postsService.deleteAllPost();

    res.sendStatus(204);
}