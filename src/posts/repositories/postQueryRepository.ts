import {PostsCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {mapperPostToViewModel} from "../differentModels/mapperPostToViewModel";
import {paginationQueryOutputModel} from "../../paginationEndpoints/paginationQueryOutputModel";
import {postViewModel} from "../differentModels/postViewModel";
import {postDbModel} from "../differentModels/postDbModel";
import {paginationViewModel} from "../differentModels/paginationViewModel";
import {inject, injectable} from "inversify";
import {PostLikeRepositories} from "../../postsLike/repositories/postLikeRepositories";


@injectable()
export class PostQueryRepository {
    constructor(
        @inject(PostLikeRepositories) protected postLikeRepositories: PostLikeRepositories,
    ) {}

    async findPostById(id:string , userId? : string):Promise<postViewModel | null> {
        const findPostInDb:WithId<postDbModel> | null = await PostsCollection.findOne({ _id: new ObjectId(id) });
        if(!findPostInDb) return null;
        //TODO сделать по нормальному
        let myStatus
        let likeStatus
        if(userId) {
            likeStatus = await this.postLikeRepositories.checkStatus(userId, findPostInDb._id.toString());
            myStatus = likeStatus ? likeStatus.myStatus : "None";
        }else {
            myStatus = "None"
        }
        const findLikesForPost = await this.postLikeRepositories.findAllLikesForPost(id);

        const post = {
            id: findPostInDb._id.toString(),
            title: findPostInDb.title,
            shortDescription: findPostInDb.shortDescription,
            content: findPostInDb.content,
            blogId: findPostInDb.blogId,
            createdAt: findPostInDb.createdAt,
            blogName: findPostInDb.blogName,
            extendedLikesInfo: {
                likesCount: findPostInDb.extendedLikesInfo.likesCount,
                dislikesCount: findPostInDb.extendedLikesInfo.dislikesCount,
                myStatus ,
                newestLikes: findLikesForPost
            }
        }
        return post

    }

    async getAllPosts(pagination: paginationQueryOutputModel, userId: string | null, filter: Record<string, any> = {}): Promise<paginationViewModel<postViewModel>> {
        const totalCount: number = await PostsCollection.countDocuments(filter);

        const items: WithId<postDbModel>[] = await PostsCollection
            .find(filter)
            .sort({ [pagination.sortBy]: pagination.sortDirection })
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize);

        const mappedItems: postViewModel[] = await Promise.all(items.map(async (post) => {

            let myStatus = "None";
            if (userId) {
                const likeStatus = await this.postLikeRepositories.checkStatus(userId, post._id.toString());
                myStatus = likeStatus ? likeStatus.myStatus : "None";
            }


            const newestLikes = await this.postLikeRepositories.findAllLikesForPost(post._id.toString());


            const extendedLikesInfo = {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus,
                newestLikes
            };


            return mapperPostToViewModel(post, extendedLikesInfo);
        }));

        return {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            items: mappedItems,
        };
    }


}