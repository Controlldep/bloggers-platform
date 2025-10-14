import { Request, Response } from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {RequestWithQuery} from "../../types/requestTypes";
import {paginationQueryInputModel} from "../../posts/differentModels/paginationQueryInputModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {blogViewModel} from "../differentModels/blogViewModel";
import {getPaginationFromQuery} from "../../posts/helpers/getPaginationFromQuery";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";

export async function getAllBlogsHandler(req: RequestWithQuery<paginationQueryInputModel>, res: Response) {
    const pagination: paginationQueryOutputModel = getPaginationFromQuery(req.query)
    const findAllBlogs: paginationViewModel<blogViewModel> = await blogsQueryRepository.getAllBlogs(pagination)

    res.status(200).send(findAllBlogs);
}
