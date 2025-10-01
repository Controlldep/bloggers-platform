import { Request, Response } from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";

export async function getAllBlogsHandler(req: Request, res: Response) {
    const query = req.query;
    const allBlogs = await blogsQueryRepository.getAllBlogs(query)

    res.status(200).send(allBlogs);
}
