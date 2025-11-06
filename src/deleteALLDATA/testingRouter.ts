import { Router, Request, Response } from "express";
import {BlogsCollection, CommentsCollection, PostsCollection, UsersCollection} from "../db/mongoDb";
export const testingRouter = Router();

testingRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await BlogsCollection.deleteMany({});
    await PostsCollection.deleteMany({});
    await UsersCollection.deleteMany({});
    await CommentsCollection.deleteMany({});

    res.sendStatus(204);
});
