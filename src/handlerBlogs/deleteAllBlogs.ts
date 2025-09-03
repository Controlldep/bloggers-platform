import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";

export async function deleteAll(req: Request, res: Response) {
    await blogsRepository.deleteAllBlogs()
    res.sendStatus(204)
}