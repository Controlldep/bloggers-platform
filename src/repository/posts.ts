
import {postModel} from "../model/postModel";


export  const postsModels:postModel[] = []

export const  postsRepository = {
    getAllPost() {
        return postsModels
    },

    createPost(post:postModel): postModel {
        const createPost:postModel = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName
        }
        postsModels.push(createPost)
        return createPost
    },

    getByIdPost(id:string) {
        const findPost = postsModels.find(b => b.id === id)
        return findPost
    },

    updatePost(id:string , post:postModel): postModel | undefined {
        let updatePost = postsModels.find(b => b.id === id)
        if(updatePost) {
            Object.assign(updatePost , {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName
            })
        }else {
            return undefined
        }
        return updatePost
    },

    deletePost(id:string) {
        const deletePost = postsModels.findIndex(b => b.id === id)
        if(deletePost !== 1) {
            postsModels.splice(deletePost , 1)
            return true
        }else  {
            return false
        }
    }
}