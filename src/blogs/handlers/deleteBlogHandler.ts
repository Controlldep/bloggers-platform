import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";
import {RequestWithParams} from "../../types/requestTypes";
import {WithId} from "mongodb";
import {blogDbModel} from "../differentModels/blogDbModel";


export async function deleteBlogHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const findBlog:WithId<blogDbModel> | null = await blogsService.findBlogById(req.params.id)
    if(!findBlog) return res.sendStatus(404)

    await blogsService.deleteBlogById(req.params.id);
    res.sendStatus(204)
}