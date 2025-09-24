import { Router, Request, Response } from "express";
import {blogsRepository} from "../blogs/repositories/blogsRepository";
import {postRepository} from "../posts/repositories/postRepository";
import {UsersRepository} from "../users/repositories/usersRepository";
import {commentsRepository} from "../comments/repositories/commentsRepository";
export const testingRouter = Router();

testingRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs();
    await postRepository.deleteAllPost();
    await UsersRepository.deleteAll();
    await commentsRepository.deleteAllComments()

    res.sendStatus(204);
});
