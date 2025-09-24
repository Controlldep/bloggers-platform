import {Collection, MongoClient, ServerApiVersion} from "mongodb";
import {postModel} from "../posts/differentModels/postModel";
import {blogModel} from "../blogs/differentModels/blogModel";
import {userModel} from "../users/differentModels/userModels";
import {commentModel} from "../comments/differentModels/commentsModel";

const uri = "mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const POSTS_COLLECTION_NAME = "posts";
const BLOGS_COLLECTION_NAME = "blogs";
const USERS_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments"

export let postsCollection:Collection<postModel>
export let blogsCollection:Collection<blogModel>
export let usersCollection:Collection<userModel>
export let commentsCollection:Collection<commentModel>

const db = client.db("bloggers-platform");

postsCollection = db.collection<postModel>(POSTS_COLLECTION_NAME);
blogsCollection = db.collection<blogModel>(BLOGS_COLLECTION_NAME);
usersCollection = db.collection<userModel>(USERS_COLLECTION_NAME);
commentsCollection = db.collection<commentModel>(COMMENTS_COLLECTION_NAME)