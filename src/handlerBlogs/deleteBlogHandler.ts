import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";

export function deleteBlogHandler(req: Request, res: Response) {
    const deleteBlog = blogsRepository.deleteBlog(req.params.id)
    if(deleteBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}