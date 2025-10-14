import { Request, Response } from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {RequestWithParams} from "../../types/requestTypes";
import {blogViewModel} from "../differentModels/blogViewModel";

export async function getBlogByIdHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const findBlogsByID:blogViewModel | null = await blogsQueryRepository.getByIdBlog(req.params.id)
    if(!findBlogsByID) return res.sendStatus(404)

    res.status(200).send(findBlogsByID)
}