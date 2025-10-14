import { Request, Response } from 'express';
import {postQueryRepository} from "../repositories/postQueryRepository";
import {paginationViewModel} from "../differentModels/paginationViewModel";
import {postViewModel} from "../differentModels/postViewModel";
import {RequestWithQuery} from "../../types/requestTypes";
import {paginationQueryInputModel} from "../differentModels/paginationQueryInputModel";
import {getPaginationFromQuery} from "../helpers/getPaginationFromQuery";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";


export async function getAllPostsHandler(req: RequestWithQuery<paginationQueryInputModel>, res: Response) {
    const pagination: paginationQueryOutputModel = getPaginationFromQuery(req.query)
    const getPostsWithPagination: paginationViewModel<postViewModel> = await postQueryRepository.getAllPosts(pagination);

    res.status(200).send(getPostsWithPagination);
}
