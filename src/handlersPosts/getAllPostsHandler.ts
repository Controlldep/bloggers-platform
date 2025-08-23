import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";


export function getAllPostsHandler(req: Request, res: Response) {
    const posts = postsRepository.getAllPost
    res.status(200).send(posts())
}