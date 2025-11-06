import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {paginationViewModel} from "../../posts/differentModels/paginationViewModel";
import {commentViewModel, mapCommentToViewModel} from "../differentModels/commentViewModel";
import {CommentsCollection, LikesCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {commentDbModel} from "../differentModels/commentsModel";
import {inject, injectable} from "inversify";
import {LikeCommentsRepository} from "../../commentsLike/repositories/likeCommentsRepository";
import {likeDbModel} from "../../commentsLike/model/likeDbModel";


@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(LikeCommentsRepository) protected likeCommentsRepository: LikeCommentsRepository,
    ) {}
//TODO разобраться с типиизацией
    async getCommentsById(id: string , userId: string) {
        const dbComment: WithId<commentDbModel> | null = await CommentsCollection.findOne({_id: new ObjectId(id)})
        if (!dbComment) return null
        let likeStatus = await this.likeCommentsRepository.checkStatus(userId, dbComment._id.toString());
        const myStatus = likeStatus ? likeStatus.myStatus : "None";
        const doc = {
            id: dbComment._id.toString(),
            content: dbComment.content,
            commentatorInfo: dbComment.commentatorInfo,
            createdAt: dbComment.createdAt,
            likesInfo: {
                likesCount: dbComment.likesInfo.likesCount,
                dislikesCount: dbComment.likesInfo.dislikesCount,
                myStatus,
            }
        }
        return doc

    }

    async getAllCommentsForPost(pagination:paginationQueryOutputModel , postId: string , userId?: string | null):Promise<paginationViewModel<commentViewModel>> {
        const filter:{ postId: string } = { postId };
        const totalCount:number = await CommentsCollection.countDocuments(filter);

        const items:WithId<commentDbModel>[] = await CommentsCollection
            .find(filter)
            .sort({ createdAt: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize);

        let userLikes: likeDbModel[] = [];

        if (userId) {
            const commentIds = items.map(c => c._id.toString());
            userLikes = await LikesCollection.find({
                userId,
                commentId: { $in: commentIds }
            });
        }

        const mappedItems: commentViewModel[] = items.map(comment => {
            const userLike = userLikes.find(like => like.commentId === comment._id.toString());
            const myStatus = userLike ? userLike.myStatus : "None";

            return mapCommentToViewModel(comment, myStatus);
        });

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems
        };
    }
}