
import { paginationQuery } from "../../paginationEndpoints/paginationQuery";
import { commentsRepository } from "../repositories/commentsRepository";
import {toCommentViewModel} from "../differentModels/mapperComment"

export const commentsService = {
    async getAllCommentsForPost(id: string, query: paginationQuery) {
        const { totalCount, items, page, pageSize } = await commentsRepository.getAllCommentsForPost(id, query);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items: items.map(c => toCommentViewModel(c)),
        };
    },

    async getCommentsById(id: string) {
        const dbComment = await commentsRepository.getCommentsById(id);
        return dbComment ? toCommentViewModel(dbComment) : null;
    },

    async createComment(id: string, data: string, userData: { id: string; userLogin: string }) {
        const dbComment = await commentsRepository.createComment(id, data, userData);
        return dbComment ? toCommentViewModel(dbComment) : null;
    },

    async updateComment(id: string, data: string) {
        return commentsRepository.updateComment(id, data);
    },

    async deleteComment(id: string) {
        return commentsRepository.deleteComment(id);
    },
};