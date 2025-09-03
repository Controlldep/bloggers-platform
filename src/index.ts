import express from "express";
import {blogsRouter} from "./routers/blogsRouter";
import {postsRouter} from "./routers/posts.Router";
import {client} from "./db/mongoDb";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(blogsRouter)
app.use(postsRouter)


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        app.listen(port, () => {
            console.log(`Server started on port: ${port}`);
        });
    } catch (e) {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);