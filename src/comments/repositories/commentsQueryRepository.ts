import {commentsRepository} from "./commentsRepository";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {commentViewModel, mapCommentToViewModel} from "../differentModels/commentViewModel";
import {commentsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {commentDbModel} from "../differentModels/commentsModel";


export const commentsQueryRepository = {
    async getCommentsById(id: string):Promise<commentViewModel | null> {
        const dbComment:WithId<commentDbModel> | null = await commentsCollection.findOne({ _id: new ObjectId(id) })

        return dbComment ? mapCommentToViewModel(dbComment) : null;
    },

    async getAllCommentsForPost(pagination:paginationQueryOutputModel , postId: string):Promise<paginationViewModel<commentViewModel>> {
        const filter:{ postId: string } = { postId };
        const totalCount:number = await commentsCollection.countDocuments(filter);

        const items:WithId<commentDbModel>[] = await commentsCollection
            .find(filter)
            .sort({ createdAt: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray();

        const mappedItems: commentViewModel[] = items.map(comments=> mapCommentToViewModel(comments))

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems
        };
    },
}