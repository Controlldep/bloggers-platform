import {Collection, MongoClient, ServerApiVersion} from "mongodb";
import {postModel} from "../model/postModel";
import {blogsModel} from "../model/blogsModel";

const uri = "mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const POSTS_COLLECTION_NAME = "posts"
const BLOGS_COLLECTION_NAME = "blogs"
export let postsCollection:Collection<postModel>
export let blogsCollection:Collection<blogsModel>
const db = client.db("bloggers-platform")

postsCollection = db.collection<postModel>(POSTS_COLLECTION_NAME)
blogsCollection = db.collection<blogsModel>(BLOGS_COLLECTION_NAME)