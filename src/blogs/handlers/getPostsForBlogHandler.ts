import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";

export async function getAllPostForBlogs(req: Request, res: Response ) {
    const createBlog = await blogsService.getAllPostForBlogs(req.params.id , req.query);

    if(createBlog) {
        res.status(201).send(createBlog)
    }else {
        res.sendStatus(404)
    }

}