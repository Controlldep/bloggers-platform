import { Request, Response } from 'express';
import {blogsModel} from "../model/blogsModel";
import {blogsService} from "../Service/blogService";

export async function getByIdBlogHandler(req: Request, res: Response) {
    const findByIdBlogs:blogsModel | null = await blogsService.getByIdBlogs(req.params.id)
    if(findByIdBlogs) {
        res.status(200).send(findByIdBlogs)
    }else {
        res.sendStatus(404)
    }
}