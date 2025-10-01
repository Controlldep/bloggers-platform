import {postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {postViewModel} from "../differentModels/postViewModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";



export const postQueryRepository = {

    async getPostByID(id:string) {
        const findPost = await postsCollection.findOne({ _id: new ObjectId(id) });
        if(!findPost) return null;
        return postViewModel(findPost);
    },

    async getAllPosts(query: paginationQuery) {
        const pageNumber = Number(query.pageNumber) || 1;
        const pageSize = Number(query.pageSize) || 10;
        const sortBy = query.sortBy || 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

        const totalCount = await postsCollection.countDocuments({});

        const items = await postsCollection
            .find({})
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedItems = items.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            page: pageNumber,
            pageSize,
            items: mappedItems,
        };
    },

}