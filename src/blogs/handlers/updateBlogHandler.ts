import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";
import {RequestWithParamsAndBody} from "../../types/requestTypes";
import {blogInputModel} from "../differentModels/blogInputModel";
import {WithId} from "mongodb";
import {blogDbModel} from "../differentModels/blogDbModel";

export async function updateBlogHandler(req: RequestWithParamsAndBody<{ id: string }, blogInputModel>, res: Response) {
    const findBlog:WithId<blogDbModel> | null = await blogsService.findBlogById(req.params.id)
    if(!findBlog) return res.sendStatus(404)

    await blogsService.updateBlog(req.params.id , req.body);
    res.sendStatus(204)
}