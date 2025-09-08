import { Request, Response } from 'express';
import {blogModel} from "../differentModels/blogModel";
import {blogsService} from "../services/blogService";

export async function getByIdBlogHandler(req: Request, res: Response) {
    const findByIdBlogs:blogModel | null = await blogsService.getByIdBlogs(req.params.id);

    if(findByIdBlogs) {
        res.status(200).send(findByIdBlogs)
    }else {
        res.sendStatus(404)
    }

}