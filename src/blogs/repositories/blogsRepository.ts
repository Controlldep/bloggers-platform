import {blogModel} from "../differentModels/blogModel";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import { ObjectId } from "mongodb";
import {postModel} from "../../posts/differentModels/postModel";


export const  blogsRepository = {
    async getBlogById(id:string) {
        const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});
        return findBlog;
    },

    async createBlog(blogs:blogModel) {
        // TODO: типизировать метод (Promise<string>)
        const blog:blogModel = {
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,

        }

        const result = await blogsCollection.insertOne(blog);
// TODO: убрать лишнюю проверку insertedId — Mongo выбросит ошибку при сбое
        if (!result.insertedId) {
            return null;
        }

        return result.insertedId.toString();
    },

    async createPostForBlog(id:string , data:any) {
        // TODO: типизировать метод (post: PostModel) => Promise<string>
        const createdAt = new Date().toISOString();
        // TODO: убрать из репозитория поиск блога (оставить только insert)
        const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if(!findBlog) {
            return null
        }
// TODO: убрать логику построения модели (она теперь в сервисе)
        const createPostForBlog:postModel= {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: id,
            createdAt,
            blogName: findBlog.name,
        };

        const result = await postsCollection.insertOne(createPostForBlog);

        return result.insertedId.toString();
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        // TODO: типизировать blogsRepository.updateBlog как Promise<boolean>
        let updateBlog = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: data}
        )

        return updateBlog.matchedCount === 1;
    },
// TODO: переименовать blogsRepository.deleteBlog → deleteBlogById
    async deleteBlog(id:string) {
        // TODO: добавить строгую типизацию (id: string) => Promise<boolean>
        const deleteBlog = await blogsCollection.deleteOne({_id: new ObjectId(id)});

        return deleteBlog.deletedCount === 1;
    },
//TODO как будто лучше это делать прямо в тетсинг дата напрямую
    async deleteAllBlogs() {
        const deletedAll = await blogsCollection.deleteMany({});

        return deletedAll.deletedCount;
    },

}