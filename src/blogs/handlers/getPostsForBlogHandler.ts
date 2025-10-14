import { Request, Response} from 'express';
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {RequestWithParamsAndQuery} from "../../types/requestTypes";
import {paginationQueryInputModel} from "../../posts/differentModels/paginationQueryInputModel";
import {blogViewModel} from "../differentModels/blogViewModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {getPaginationFromQuery} from "../../posts/helpers/getPaginationFromQuery";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {postViewModel} from "../../posts/differentModels/postViewModel";

export async function getPostsByBlogIdHandler(req: RequestWithParamsAndQuery<{ id: string } , paginationQueryInputModel>, res: Response ) {
    const blog:blogViewModel | null = await blogsQueryRepository.getByIdBlog(req.params.id);
    if (!blog)return res.sendStatus(404);

    const pagination:paginationQueryOutputModel = getPaginationFromQuery(req.query)
    const getAllPostsForBlog:paginationViewModel<postViewModel> = await blogsQueryRepository.getAllPostsForBlog(pagination , req.params.id );


    res.status(200).send(getAllPostsForBlog)
}