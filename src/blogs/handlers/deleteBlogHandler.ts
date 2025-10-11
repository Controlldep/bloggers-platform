import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";

// TODO: добавить типизацию для req.params.id и возвращаемого значения deleteBlog
export async function deleteBlogHandler(req: Request, res: Response) {
    const deleteBlog = await blogsService.deleteBlog(req.params.id);
    // TODO: обернуть все в трайкетч
// TODO: сначала проверить существование блога через blogsService.findBlogById; если нет — вернуть 404, иначе удалить
    if(deleteBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

}