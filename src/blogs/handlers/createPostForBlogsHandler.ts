import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";

export async function createPostForBlogHandler(req: Request, res: Response ) {

    const createPostForBlog = await blogsService.createPostForBlog(req.params.id, req.body);

    if(createPostForBlog) {
        res.status(201).send(createPostForBlog)
    }else {
        res.sendStatus(404)
    }

}