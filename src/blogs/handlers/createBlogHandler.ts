import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

export async function createBlogHandler(req: Request, res: Response ) {

    const createBlog = await blogsService.createBlog(req.body);

    if(createBlog) {
        res.status(201).send(createBlog)
    }else {
        res.sendStatus(400)
    }

}