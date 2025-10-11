import { Request, Response} from 'express';
import {blogsService} from "../services/blogService";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";
// TODO: рассмотреть переименование createPostForBlogHandler → createPostForBlogController
export async function createPostForBlogHandler(req: Request, res: Response ) {
// TODO: добавить строгую типизацию req.body, req.params.id и возвращаемого значения
    const createPostForBlog = await blogsService.createPostForBlog(req.params.id, req.body);

    if(!createPostForBlog) {
        return res.sendStatus(404)
    }
// TODO: переместить получение findPost внутрь blogsService.createPostForBlog (пусть возвращает PostViewModel) и изменит название на получение поста
    const findPost = await postQueryRepository.getPostByID(createPostForBlog);

    if(findPost) {
        res.status(201).send(findPost)
    }else {
        res.sendStatus(404)
    }
// TODO: упростить логику if-ов, объединить проверки и использовать ранние возвраты
}
// TODO: обернуть в try/catch, вернуть 500 при ошибке