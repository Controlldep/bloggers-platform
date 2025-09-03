import { Request, Response } from 'express';
import {blogsService} from "../Service/blogService";

export async function getAllBlogsHandler(req: Request, res: Response) {
    const blogs = await blogsService.getAllBlogs()
    res.status(200).send(blogs)
}
