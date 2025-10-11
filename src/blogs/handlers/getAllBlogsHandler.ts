import { Request, Response } from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
// TODO: обернуть в try/catch, вернуть 500 при сбое БД
export async function getAllBlogsHandler(req: Request, res: Response) {
    // TODO: добавить типизацию для req.query (BlogsQueryParams)
    // TODO ИЛИ
    // TODO: передавать req.query напрямую в blogsQueryRepository.getAllBlogs
    const query = req.query;
    // TODO: добавить типизацию для возвращаемого результата (PaginationResult<BlogViewModel>)
    const allBlogs = await blogsQueryRepository.getAllBlogs(query)
    // TODO: переименовать allBlogs → blogs или blogsResult (для большей читаемости)
    res.status(200).send(allBlogs);
}
