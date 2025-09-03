import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";

export async function getAllBlogsHandler(req: Request, res: Response) {
    const blogs = await blogsRepository.getAllBlogs()
    res.status(200).send(blogs)
}
