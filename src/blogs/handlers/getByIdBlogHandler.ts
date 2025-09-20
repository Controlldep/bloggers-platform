import { Request, Response } from 'express';
import {blogModel} from "../differentModels/blogModel";
import {blogsService} from "../services/blogService";

export async function getByIdBlogHandler(req: Request, res: Response) {
    const findBlogsByID:blogModel | null = await blogsService.getByIdBlog(req.params.id);

    if(findBlogsByID) {
        res.status(200).send(findBlogsByID)
    }else {
        res.sendStatus(404)
    }

}