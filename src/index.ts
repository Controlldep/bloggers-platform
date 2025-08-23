import express from "express";
import {blogsRouter} from "./routers/blogsRouter";
import {postsRouter} from "./routers/posts.Router";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(blogsRouter)
app.use(postsRouter)

app.listen(port , () => {
    console.log(`Server started on port: ${port}`)
})