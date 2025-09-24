import {Request, Response} from 'express';
import {postsService} from "../service/postService";
import {postModel} from "../differentModels/postModel";

//TODO типизировать реквест ( пример )
export async function createPostHandler(req: Request<{}, {}, postModel>, res: Response) {
    const createPost = await postsService.createPost(req.body);

    if (createPost) {
        res.status(201).send(createPost)
        return
    }

    res.sendStatus(400)

}