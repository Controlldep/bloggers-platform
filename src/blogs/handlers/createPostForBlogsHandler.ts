import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";

export async function createPostForBlogHandler(req: Request, res: Response ) {

    const createPostForBlog = await blogsService.createPostForBlog(req.params.id, req.body);

    if(!createPostForBlog) {
        return res.sendStatus(404)
    }

    const findPost = await postQueryRepository.getPostByID(createPostForBlog);

    if(findPost) {
        res.status(201).send(findPost)
    }else {
        res.sendStatus(404)
    }

}