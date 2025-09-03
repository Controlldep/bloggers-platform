import { Request, Response } from 'express';
import {blogsService} from "../Service/blogService";

export async function deleteAll(req: Request, res: Response) {
    await blogsService.deleteAllBlogs()
    res.sendStatus(204)
}