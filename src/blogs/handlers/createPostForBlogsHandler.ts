import { Request, Response} from 'express';
import {blogsInputValidation} from "../../middleware/blogsMiddleware/blogValidation";
import {blogsService} from "../services/blogService";

export async function createPostForBlogHandler(req: Request, res: Response ) {
    const errors = blogsInputValidation(req.body);

    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
        return;
    }

    const createBlog = await blogsService.createPostForBlogs(req.params.id, req.body);

    if(createBlog) {
        res.status(201).send(createBlog)
    }else {
        res.sendStatus(404)
    }

}