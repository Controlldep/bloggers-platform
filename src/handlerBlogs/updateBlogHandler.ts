import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";
import {blogsModel} from "../model/blogsModel";

export function updateBlogHandler(req: Request, res: Response) {
    const updateBlog:blogsModel | undefined = blogsRepository.updateBlog(req.params.id , req.body)
    if(updateBlog) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }
}