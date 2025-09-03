import { Request, Response } from 'express';
import {postsRepository} from "../repository/posts";


export async function getAllPostsHandler(req: Request, res: Response) {
    const posts = await postsRepository.getAllPost()
    res.status(200).send(posts)
}