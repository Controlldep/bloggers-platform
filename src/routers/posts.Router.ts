import express, {Router} from "express";


export const postsRouter = Router();

postsRouter
    .get('/' , getPosts)
    .post('/' , createPosts)
    .get('/:id' , getByIdPosts)
    .put('/:id' , updatePosts)
    .delete('/:id' , deletePosts)