import {blogModel} from "../differentModels/blogModel";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import {postModel} from "../../posts/differentModels/postModel";
import {paginationQuery} from "../../paginationEndpoints/paginationQuery";


export const  blogsRepository = {

    async getAllBlogs(query: paginationQuery) {
        const pageNumber = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
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

        const mappedItems = items.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership ?? false
        }));

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedItems,
        };
    },

    async createBlogs(blogs:blogModel) {
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

    async getByIdBlogs(id:string) {
        const findBlogs = await blogsCollection.findOne({ _id: new ObjectId(id) });

        return findBlogs;
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        let result = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return result.matchedCount === 1;
    },

    async deleteBlog(id:string) {
        const deleteBlog = await blogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },

    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

    async getAllPostForBlogs(blogId: string, query: paginationQuery) {
        const pageNumber = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
        const filter = { blogId };
        const totalCount = await postsCollection.countDocuments(filter);

        const items = await postsCollection
            .find(filter)
            .sort({ createdAt: -1 }) // последние посты сверху
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedItems = items.map(({ _id, ...rest }) => ({
            id: _id.toString(),
            ...rest,
        }));

        return {
            totalCount,
            items: mappedItems,
            pageNumber,
            pageSize,
        };
    },

    async createPostForBlogs(id:string , data:any) {
        const createdAt = new Date().toISOString();
        const findBlogs = await blogsCollection.findOne({_id: new ObjectId(id)});

        if(!findBlogs) {
            return null
        }

        const createPostForBlogs:postModel= {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: id,
            createdAt,
            blogName: findBlogs.name,
        };

        const result = await postsCollection.insertOne(createPostForBlogs);
        const created = await postsCollection.findOne({ _id: result.insertedId });

        if (!created) return null;

        return { ...created, id: created._id.toString() };
    },
}