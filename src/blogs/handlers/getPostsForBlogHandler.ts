import { Request, Response} from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";

export async function getAllPostForBlogs(req: Request, res: Response ) {
    const blog = await blogsQueryRepository.getByIdBlog(req.params.id);

    if (!blog) {
        return res.sendStatus(404);
    }

    const getAllPostsForBlog = await blogsQueryRepository.getAllPostsForBlog(req.params.id , req.query);

    if(getAllPostsForBlog) {
        res.status(200).send(getAllPostsForBlog)
    }else {
        res.sendStatus(404)
    }

}