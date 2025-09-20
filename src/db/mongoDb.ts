import {Collection, MongoClient, ServerApiVersion} from "mongodb";
import {postModel} from "../posts/differentModels/postModel";
import {blogModel} from "../blogs/differentModels/blogModel";
import {userModel} from "../users/differentModels/userModels";

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

export let postsCollection:Collection<postModel>
export let blogsCollection:Collection<blogModel>
export let usersCollection:Collection<userModel>

const db = client.db("bloggers-platform");

postsCollection = db.collection<postModel>(POSTS_COLLECTION_NAME);
blogsCollection = db.collection<blogModel>(BLOGS_COLLECTION_NAME);
usersCollection = db.collection<userModel>(USERS_COLLECTION_NAME)