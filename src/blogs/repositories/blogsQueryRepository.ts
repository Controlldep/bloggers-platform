import {BlogsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {mapBlogToViewModel} from "../differentModels/mapBlogToViewModel";
import {blogViewModel} from "../differentModels/blogViewModel";
import {blogDbModel} from "../differentModels/blogDbModel";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {PostQueryRepository} from "../../posts/repositories/postQueryRepository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {

    constructor(@inject(PostQueryRepository) private postQueryRepository: PostQueryRepository) {}

    async getByIdBlog(id:string):Promise<blogViewModel | null> {
        const findBlog:WithId<blogDbModel>| null = await BlogsCollection.findOne({ _id: new ObjectId(id) });
        if(!findBlog) return null

        return mapBlogToViewModel(findBlog);
    }

    async getAllPostsForBlog(pagination: paginationQueryOutputModel , blogId: string,) {
        return this.postQueryRepository.getAllPosts(pagination, { blogId })
    }

    async getAllBlogs(pagination: paginationQueryOutputModel):Promise<paginationViewModel<blogViewModel>> {
        const filter: any = {}
        if (pagination.searchNameTerm) {
            filter.name = { $regex: pagination.searchNameTerm, $options: 'i' }
        }

        const totalCount:number = await BlogsCollection.countDocuments(filter);

        const items:WithId<blogDbModel>[] = await BlogsCollection
            .find(filter)
            .sort({ [pagination.sortBy]: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize);

        const mappedItems:blogViewModel[] = items.map(blog => (mapBlogToViewModel(blog)));

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems,
        };
    }
}