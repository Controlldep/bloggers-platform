import {postDbModel} from "../differentModels/postDbModel";
import {CommentsCollection, PostsCollection} from "../../db/mongoDb";
import {DeleteResult, ObjectId, WithId} from "mongodb";
import {blogDbModel} from "../../blogs/differentModels/blogDbModel";
import {postInputModel} from "../differentModels/postInputModel";
import {injectable} from "inversify";
import {commentDbModel} from "../../comments/differentModels/commentsModel";

@injectable()
export class PostRepository {
    async createPost(post: postDbModel):Promise<string> {
        const result:WithId<postDbModel>  = await PostsCollection.create(post);

        return result._id.toString();
    }

    async findPost(id: string):Promise<WithId<postDbModel> | null> {
        const result = await PostsCollection.findOne({_id: new ObjectId(id)})
        return result

    }

    async updatePost(id: string, post: postInputModel , findBlog: blogDbModel):Promise<postDbModel | null> {
        const updatePost:postDbModel | null = await PostsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: findBlog.name,
                },
            },
            { returnDocument: 'after' }
        );

        if (!updatePost) return null;

        return updatePost;
    }

    async deletePost(id:string):Promise<boolean> {
        const deletePost:DeleteResult = await PostsCollection.deleteOne({_id: new ObjectId(id)});

        return deletePost.deletedCount === 1;
    }

    async updateLikesInfo(post:WithId<postDbModel>) {
        await PostsCollection.updateOne(
            { _id: post._id },
            { $set: { extendedLikesInfo: post.extendedLikesInfo } } )

        return true
    }

}
