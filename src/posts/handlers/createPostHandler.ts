import {Request, Response} from 'express';
import {postsService} from "../service/postService";
import {postModel} from "../differentModels/postModel";
import {postQueryRepository} from "../repositories/postQueryRepository";


export async function createPostHandler(req: Request<{}, {}, postModel>, res: Response) {
    const createPost = await postsService.createPost(req.body);

    if (!createPost) return res.sendStatus(400)

    const getPostById = await postQueryRepository.getPostByID(createPost);
    if(!getPostById) return res.sendStatus(404)

    res.status(201).send(getPostById)
}