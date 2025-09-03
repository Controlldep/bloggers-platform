import { Request, Response } from 'express';
import {blogsRepository} from "../repository/blogs";
import {blogsModel} from "../model/blogsModel";

export async function getByIdBlogHandler(req: Request, res: Response) {
    const findByIdBlogs:blogsModel | null = await blogsRepository.getByIdBlogs(req.params.id)
    if(findByIdBlogs) {
        res.status(200).send(findByIdBlogs)
    }else {
        res.sendStatus(404)
    }
}