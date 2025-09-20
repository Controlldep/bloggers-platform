import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";

export async function getAllPostForBlogs(req: Request, res: Response ) {
    const getAllPostsForBlog = await blogsService.getAllPostsForBlog(req.params.id , req.query);

    if(getAllPostsForBlog) {
        res.status(200).send(getAllPostsForBlog)
    }else {
        res.sendStatus(404)
    }

}