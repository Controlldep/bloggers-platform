import { Request, Response} from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
// TODO: переименовать getAllPostForBlogs → getPostsByBlogIdHandler
export async function getAllPostForBlogs(req: Request, res: Response ) {
    const blog = await blogsQueryRepository.getByIdBlog(req.params.id);
// TODO: добавить типизацию для req.params.id, req.query и результата
    if (!blog) {
        return res.sendStatus(404);
    }
// TODO: проверить, что используется корректный репозиторий (postsQueryRepository) логика нарушена я обращаюсь к блогам а не постам
    const getAllPostsForBlog = await blogsQueryRepository.getAllPostsForBlog(req.params.id , req.query);
// TODO: убрать лишний if
    if(getAllPostsForBlog) {
        res.status(200).send(getAllPostsForBlog)
    }else {
        res.sendStatus(404)
    }

}