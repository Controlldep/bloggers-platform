import {blogModel} from "../differentModels/blogModel";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import {postModel} from "../../posts/differentModels/postModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";
import {blogViewModel} from "../differentModels/blogViewModel";
import {paginationModel} from "../../paginationEndpoints/paginationModel";
import {postViewModel} from "../../posts/differentModels/postViewModel";


export const  blogsRepository = {

    async getAllBlogs(query: paginationQuery) {
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1;


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

    async getByIdBlog(id:string) {
        const findBlogs = await blogsCollection.findOne({ _id: new ObjectId(id) });

        return findBlogs;
    },

    async createBlog(blogs:blogModel) {
        const blog:blogModel = {
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,

        }

        const result = await blogsCollection.insertOne(blog);
        const created = await blogsCollection.findOne({ _id: result.insertedId });

        return created;
    },

    async createPostForBlog(id:string , data:any) {
        const createdAt = new Date().toISOString();
        const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if(!findBlog) {
            return null
        }

        const createPostForBlog:postModel= {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: id,
            createdAt,
            blogName: findBlog.name,
        };

        const result = await postsCollection.insertOne(createPostForBlog);
        const created = await postsCollection.findOne({ _id: result.insertedId });

        if (!created) return null;
        return created
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        let updateBlog = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return updateBlog.matchedCount === 1;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

}