import {PostsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {mapperPostToViewModel} from "../differentModels/mapperPostToViewModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {postViewModel} from "../differentModels/postViewModel";
import {postDbModel} from "../differentModels/postDbModel";
import {paginationViewModel} from "../differentModels/paginationViewModel";
import {injectable} from "inversify";


@injectable()
export class PostQueryRepository {
    async findPostById(id:string):Promise<postViewModel | null> {
        const findPostInDb:WithId<postDbModel> | null = await PostsCollection.findOne({ _id: new ObjectId(id) });

        if(!findPostInDb) return null;

        return mapperPostToViewModel(findPostInDb);
    }

    async getAllPosts(pagination: paginationQueryOutputModel , filter: Record<string, any> = {}):Promise<paginationViewModel<postViewModel>> {

        const totalCount: number = await PostsCollection.countDocuments(filter);

        const items: WithId<postDbModel>[] = await PostsCollection
            .find(filter)
            .sort({ [pagination.sortBy]: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize);

        const mappedItems: postViewModel[] = items.map(post=> mapperPostToViewModel(post))

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems,
        };
    }

}