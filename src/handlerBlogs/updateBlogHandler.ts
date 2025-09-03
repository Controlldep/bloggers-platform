import { Request, Response } from 'express';
import {blogsInputValidation} from "../middleware/blogsMiddleware/blogsMiddlewareValidation";
import {blogsService} from "../Service/blogService";

export async function updateBlogHandler(req: Request, res: Response) {
    const errors = blogsInputValidation(req.body)
    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
        return;
    }
    const updateBlog = await blogsService.updateBlog(req.params.id , req.body)
    if(updateBlog) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }
}