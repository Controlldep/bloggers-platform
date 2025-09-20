import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

export async function updateBlogHandler(req: Request, res: Response) {

    const updateBlog = await blogsService.updateBlog(req.params.id , req.body);

    if(updateBlog) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }

}