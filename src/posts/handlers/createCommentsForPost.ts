import { Request, Response } from "express";
import {commentsService} from "../../comments/service/commentsService";
import { ObjectId } from "mongodb";
import {UsersService} from "../../users/service/userService";
import {postQueryRepository} from "../repositories/postQueryRepository";

export const createCommentHandler = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = req.userId; // authMiddleware уже положил сюда id
    const { content } = req.body;

    if (!userId) {
        return res.sendStatus(401);
    }

    if (!ObjectId.isValid(postId)) {
        return res.sendStatus(404);
    }

    const post = await postQueryRepository.getPostByID(postId);
    if (!post) {
        return res.sendStatus(404);
    }

    if (!content || content.length < 20 || content.length > 300) {
        return res.status(400).json({
            errorsMessages: [
                { message: "Content length must be 20-300 characters", field: "content" },
            ],
        });
    }
    const dbUser = await UsersService.findUserById(userId);
    if (!dbUser) return res.sendStatus(401);

    const newComment = await commentsService.createComment(postId, content, {
        id: userId,
        userLogin: dbUser.login,
    });


    return res.status(201).json(newComment);
};