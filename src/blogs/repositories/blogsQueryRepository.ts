import {blogsCollection, postsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {mapperPostToViewModel} from "../../posts/differentModels/mapperPostToViewModel";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {mapBlogToViewModel} from "../differentModels/mapBlogToViewModel";
import {blogViewModel} from "../differentModels/blogViewModel";
import {blogDbModel} from "../differentModels/blogDbModel";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";

export const blogsQueryRepository = {

    async getByIdBlog(id:string):Promise<blogViewModel | null> {
        const findBlog:WithId<blogDbModel>| null = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if(!findBlog) return null

        return mapBlogToViewModel(findBlog);
    },

    async getAllPostsForBlog(pagination: paginationQueryOutputModel , blogId: string,) {
        return postQueryRepository.getAllPosts(pagination, { blogId })
    },

    async getAllBlogs(pagination: paginationQueryOutputModel):Promise<paginationViewModel<blogViewModel>> {
        const filter: any = {}
        if (pagination.searchNameTerm) {
            filter.name = { $regex: pagination.searchNameTerm, $options: 'i' }
        }

        const totalCount:number = await blogsCollection.countDocuments(filter);

        const items:WithId<blogDbModel>[] = await blogsCollection
            .find(filter)
            .sort({ [pagination.sortBy]: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray();

        const mappedItems:blogViewModel[] = items.map(blog => (mapBlogToViewModel(blog)));

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems,
        };
    },
}