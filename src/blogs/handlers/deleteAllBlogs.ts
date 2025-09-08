import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

export async function deleteAll(req: Request, res: Response) {
    await blogsService.deleteAllBlogs();

    res.sendStatus(204);
}