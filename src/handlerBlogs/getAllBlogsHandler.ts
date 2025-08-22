import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";


export function getAllBlogsHandler(req: Request, res: Response) {
    const blogs = blogsRepository.getAllBlogs
    res.status(200).send(blogs())
}