import { Request, Response } from 'express';
import {blogModel} from "../differentModels/blogModel";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
// TODO: переименовать getByIdBlogHandler → getBlogByIdHandler
export async function getByIdBlogHandler(req: Request, res: Response) {
    // TODO: добавить типизацию для req.params.id и возвращаемого значения (BlogViewModel | null)
    const findBlogsByID:blogModel | null = await blogsQueryRepository.getByIdBlog(req.params.id)
// TODO: упростить if-else, использовать ранний возврат при отсутствии блога
    if(findBlogsByID) {
        res.status(200).send(findBlogsByID)
    }else {
        res.sendStatus(404)
    }

}