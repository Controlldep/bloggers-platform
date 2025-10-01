import { Request, Response } from 'express';
import {postQueryRepository} from "../repositories/postQueryRepository";


export async function getAllPostsHandler(req: Request, res: Response) {
    const posts = await postQueryRepository.getAllPosts(req.query);

    res.status(200).send(posts);
}