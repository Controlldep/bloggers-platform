import { Request, Response } from 'express';
import {blogsService} from "../services/blogService";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
//TODO разделить хендлеры на квери и круды
//TODO улучшить структуру папок
//TODO создать ObjectResult
//TODO прочитать и запонмит разницу между хешированием шифрованием и кодированием
//TODO прочитать и запонмит HTTP и HTTPS
//TODO сдать все экзамены
//TODO просмотреть все видосы из доп материала
//TODO  у меня есть мидлеваре для проверки валдиности токена надо его вставить в логаут рефреш и логинизацию хендлеры
export async function createBlogHandler(req: Request, res: Response ) {
// TODO: добавить типизацию req.body (BlogInputModel)
    const createBlog = await blogsService.createBlog(req.body);
// TODO: убрать лишнюю проверку на !createBlog — валидация уже защищает
    if (!createBlog) {
        return res.sendStatus(400)
    }
// TODO: обернуть логику в try/catch и вернуть 500 при ошибке
    const findBlog = await blogsQueryRepository.getByIdBlog(createBlog);
// TODO: упростить if-ы, использовать ранний возврат
    if(findBlog) {
        res.status(201).send(findBlog)
    }else {
        res.sendStatus(400)
    }

}