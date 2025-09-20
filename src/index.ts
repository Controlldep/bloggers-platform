import express from "express";
import {blogsRouter} from "./blogs/routers/blogsRouter";
import {postsRouter} from "./posts/routers/postsRouter";
import {client} from "./db/mongoDb";
import {testingRouter} from "./deleteALLDATA/testingRouter";
import {authRouter} from "./authorization/authRouter";
import {usersRouter} from "./users/routers/usersRouter";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(blogsRouter)
app.use(postsRouter)
app.use(testingRouter)
app.use(authRouter)
app.use(usersRouter)

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.listen(port, () => {
            console.log(`Server started on port: ${port}`);
        });

    } catch (e) {
        await client.close();
    }
}
run().catch(console.dir);