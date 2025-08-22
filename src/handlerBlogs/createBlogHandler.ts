import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";

export function createBlogHandler(req: Request, res: Response) {
    const createBlog = blogsRepository.createBlogs(req.body)
    if(createBlog) {
        res.status(201).send(createBlog)
    }else {
        res.sendStatus(400)
    }
}