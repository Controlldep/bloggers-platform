import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";


export async function deleteBlogHandler(req: Request, res: Response) {
    const deleteBlog = await blogsService.deleteBlog(req.params.id);

    if(deleteBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}