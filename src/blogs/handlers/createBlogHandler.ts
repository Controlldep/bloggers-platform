import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {RequestWithBody} from "../../types/requestTypes";
import {blogInputModel} from "../differentModels/blogInputModel";
import {blogViewModel} from "../differentModels/blogViewModel";
//TODO улучшить структуру папок
//TODO создать ObjectResult
//TODO прочитать и запонмит разницу между хешированием шифрованием и кодированием
//TODO прочитать и запонмит HTTP и HTTPS

export async function createBlogHandler(req: RequestWithBody<blogInputModel>, res: Response ) {

    const createBlog:string | null = await blogsService.createBlog(req.body);

    const findBlog:blogViewModel | null = await blogsQueryRepository.getByIdBlog(createBlog);
    if(!findBlog) return res.sendStatus(404)

    res.status(201).send(findBlog)

}