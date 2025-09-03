import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";


export async function deleteBlogHandler(req: Request, res: Response) {
    const deleteBlog = await blogsRepository.deleteBlog(req.params.id)
    if(deleteBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}