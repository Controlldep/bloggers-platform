import { Request, Response } from 'express';
import {blogModel} from "../differentModels/blogModel";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";

export async function getByIdBlogHandler(req: Request, res: Response) {
    const findBlogsByID:blogModel | null = await blogsQueryRepository.getByIdBlog(req.params.id)

    if(findBlogsByID) {
        res.status(200).send(findBlogsByID)
    }else {
        res.sendStatus(404)
    }

}