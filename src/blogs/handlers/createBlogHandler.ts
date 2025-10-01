import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";

export async function createBlogHandler(req: Request, res: Response ) {

    const createBlog = await blogsService.createBlog(req.body);

    if (!createBlog) {
        return res.sendStatus(400)
    }

    const findBlog = await blogsQueryRepository.getByIdBlog(createBlog);

    if(findBlog) {
        res.status(201).send(findBlog)
    }else {
        res.sendStatus(400)
    }

}