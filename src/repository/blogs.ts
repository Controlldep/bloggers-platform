import {blogsModel} from "../model/blogsModel";


export  const blogsArray:blogsModel[] = []

export const  blogsRepository = {
    getAllBlogs() {
        return blogsArray
    },

    createBlogs(blogs:blogsModel): blogsModel {
        const blog:blogsModel = {
            id: blogs.id,
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl
        }
        blogsArray.push(blog)
        return blog
    },

    getByIdBlogs(id:string) {
        const findBlogs = blogsArray.find(b => b.id === id)
        return findBlogs
    },

    updateBlog(id:string , blogs:blogsModel): blogsModel | undefined {
        let updateBlogs = blogsArray.find(b => b.id === id)
        if(updateBlogs) {
            Object.assign(updateBlogs , {
                id: blogs.id,
                name: blogs.name,
                description: blogs.description,
                websiteUrl: blogs.websiteUrl
            })
        }else {
            return undefined
        }
        return updateBlogs
    },

    deleteBlog(id:string) {
        const deleteBlog = blogsArray.findIndex(b => b.id === id)
        if(deleteBlog !== 1) {
            blogsArray.splice(deleteBlog , 1)
            return true
        }else  {
            return false
        }
    }
}