import {blogsRepository} from "../repositories/blogsRepository";
import {blogModel} from "../differentModels/blogModel";


export const  blogsService = {
    // TODO: типизировать метод (Promise<string>)
    async createBlog(blogs: blogModel) {
        const createBlog = await blogsRepository.createBlog(blogs);
// TODO: убрать лишнюю проверку if (!createBlog)
        if (!createBlog) return null;

        return createBlog;
    },

    async createPostForBlog(id: string  , data:any) {
        // TODO: типизировать параметры (blogId: string, data: PostInputModel) и возвращаемое значение (Promise<PostViewModel | null>)
        const createPost = await blogsRepository.createPostForBlog(id , data );
// TODO: вынести поиск блога сюда (не делать его в репозитории)
        // TODO: формировать модель поста (postModel) здесь, а не в репозитории
        // TODO: убрать лишнюю проверку if (!createPost)
        if (!createPost) {
            return null
        }

        return createPost;
    },

    async updateBlog(id: string, data: Partial<blogModel>)  {
        // TODO: типизировать blogsService.updateBlog как Promise<boolean>
        let updateBlog = await blogsRepository.updateBlog(id , data);

        return updateBlog;
    },
// TODO: переименовать blogsService.deleteBlog → deleteBlogById
    async deleteBlog(id:string) {
        // TODO: добавить строгую типизацию (id: string) => Promise<boolean>
        const deleteBlog = await blogsRepository.deleteBlog(id);

        return deleteBlog;
    },

}