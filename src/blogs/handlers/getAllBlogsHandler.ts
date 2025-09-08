import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

export async function getAllBlogsHandler(req: Request, res: Response) {
    const query = req.query;
    const blogs = await blogsService.getAllBlogs(query);

    res.status(200).send(blogs);
}
