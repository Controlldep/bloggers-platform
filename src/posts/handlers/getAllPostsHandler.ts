import { Request, Response } from 'express';
import {postsService} from "../service/postService";


export async function getAllPostsHandler(req: Request, res: Response) {
    const posts = await postsService.getAllPosts(req.query);

    res.status(200).send(posts);
}