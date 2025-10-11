import {blogsCollection, postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";
import {postViewModel} from "../../posts/differentModels/postViewModel";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {blogViewModel} from "../differentModels/blogViewModel";


export const blogsQueryRepository = {

    async getByIdBlog(id:string) {
        // TODO: типизировать метод (id: string) => Promise<BlogViewModel | null>
        const findBlogs = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if(!findBlogs) return null

        return blogViewModel(findBlogs);
    },

    async getAllPostsForBlog(blogId: string, query: paginationQuery) {
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
        const filter = { blogId };
        const totalCount = await postsCollection.countDocuments(filter);

        const items = await postsCollection
            .find(filter)
            .sort({ createdAt: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedItems = items.map(post => (postViewModel(post)))
        const pagesCount = Math.ceil(totalCount / pageSize);

        type BlogViewModel = ReturnType<typeof postViewModel>;

        const result: paginationModel<BlogViewModel> = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedItems,
        };

        return result;
    },

    async getAllBlogs(query: paginationQuery) {
        // TODO: типизировать метод
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

// TODO: заменить filter: any на конкретный тип (Record<string, any> или Partial<BlogDbModel>)
        const filter: any = query.searchNameTerm
            ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
            : {};

        const totalCount = await blogsCollection.countDocuments(filter);

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedItems = items.map(blog => (blogViewModel(blog)));
        const pagesCount = Math.ceil(totalCount / pageSize);
// TODO: вынести объявление типа BlogViewModel из функции наружу
        type BlogViewModel = ReturnType<typeof blogViewModel>;

        const result: paginationModel<BlogViewModel> = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedItems,
        };

        return result;
    },
}