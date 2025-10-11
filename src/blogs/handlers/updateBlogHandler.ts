import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

export async function updateBlogHandler(req: Request, res: Response) {
// TODO: сначала проверить существование блога через blogsService.findBlogById; если не найден — вернуть 404, иначе обновить
    const updateBlog = await blogsService.updateBlog(req.params.id , req.body);
// TODO: добавить строгую типизацию req.params.id, req.body и возвращаемого значения updateBlog
    // TODO: упростить if-else, использовать ранний возврат при отсутствии блога
    if(updateBlog) {
        res.sendStatus(204)
    }else {
        res.sendStatus(404)
    }

}