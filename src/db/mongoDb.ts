import {commentDbModel} from "../comments/differentModels/commentsModel";
import {refreshModel} from "../authorization/differenModels/refreshModel";
import {sessionModel} from "../securityDevices/models/sessionModel";
import mongoose, { Schema, model } from 'mongoose';

export const uri = "mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const  PostSchema = new Schema({
    title: {type: String , required: true},
    shortDescription: {type: String , required: true},
    content: {type: String , required: true},
    blogId: {type: String , required: true},
    createdAt: {type: String , required: true},
    blogName: {type: String , required: true},
})
export const PostsCollection = model('posts', PostSchema);
//TODO протипизировать схемы

const  BlogSchema = new Schema({
    name: {type: String , required: true},
    description: {type: String , required: true},
    websiteUrl: {type: String , required: true},
    createdAt: {type: String , required: true},
    isMembership: {type: Boolean , required: true},
})
export const BlogsCollection = model('blogs', BlogSchema);


const  UsersSchema = new Schema({
    login: {type: String , required: true},
    email: {type: String , required: true},
    password: {type: String , required: true},
    createdAt: {type: String , required: true},
    confirmationCode: { type: String, default: null },
    expirationDate: { type: Date, default: null },
    isConfirmed: { type: Boolean, default: false },
})
export const UsersCollection = model('users', UsersSchema);


const  CommentsSchema:Schema<commentDbModel> = new Schema({
    content: {type: String , required: true},
    postId: {type: String , required: true},
    commentatorInfo: {
        userId: {type: String , required: true},
        userLogin:{type: String , required: true},
    },
    createdAt: {type: String , required: true},
    likesInfo: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
    }
})
export const CommentsCollection = model('comments', CommentsSchema);


const LikeSchema = new Schema({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    myStatus: { type: String, enum: ["Like", "Dislike", "None"], default: "None" },
});
export const LikesCollection = model("likes", LikeSchema);


const  RefreshSchema:Schema<refreshModel> = new Schema({
    userId: {type: String , required: true},
    jtiHash: {type: String , required: true},
    deviceId: {type: String , required: true},
    expiresAt: {type: Date , required: true},
})
export const RefreshTokensCollection = model('refreshTokens', RefreshSchema);


const  SessionSchema:Schema<sessionModel> = new Schema({
    deviceId: {type: String , required: true},
    userId: {type: String , required: true},
    ip: {type: String , required: true},
    deviceTitle: {type: String , required: true},
    lastActiveDate: {type: String , required: true},
    expirationDate: {type: String , required: true},
})
export const SessionCollection = model('session', SessionSchema);
