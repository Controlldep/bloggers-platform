import request from "supertest";
import {app} from "../../src";
import { ObjectId } from "mongodb";

describe("GET /comments/:id", () => {
    let token: string;
    let comment: any;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({ login: "user1", password: "123456", email: "u1@mail.com" })
            .expect(201);

        const loginRes = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "123456" })
            .expect(200);

        token = loginRes.body.accessToken;

        const blog = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blog",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const post = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "title",
                shortDescription: "short",
                content: "content",
                blogId: blog.body.id,
            })
            .expect(201);

        const commentRes = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set("Authorization", `Bearer ${token}`)
            .send({ content: "valid comment content here" })
            .expect(201);

        comment = commentRes.body;
    });

    it("should return 200 and comment by id", async () => {
        const res = await request(app).get(`/comments/${comment.id}`).expect(200);
        expect(res.body).toEqual({
            id: expect.any(String),
            content: "valid comment content here",
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: "user1",
            },
            createdAt: expect.any(String),
        });
    });

    it("should return 404 if comment not found", async () => {
        await request(app).get(`/comments/${new ObjectId()}`).expect(404);
    });
});

describe("PUT /comments/:commentId", () => {
    let accessToken: string;
    let anotherToken: string;
    let createdPost: any;
    let createdComment: any;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        const blog = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "test blog",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const post = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "post",
                shortDescription: "short",
                content: "content",
                blogId: blog.body.id,
            })
            .expect(201);

        createdPost = post.body;

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "user1",
                password: "password",
                email: "user1@test.com",
            })
            .expect(201);

        const loginRes1 = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "password" })
            .expect(200);

        accessToken = loginRes1.body.accessToken;

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "user2",
                password: "password",
                email: "user2@test.com",
            })
            .expect(201);

        const loginRes2 = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user2", password: "password" })
            .expect(200);

        anotherToken = loginRes2.body.accessToken;

        const comment = await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "this is a valid comment content with enough length" })
            .expect(201);

        createdComment = comment.body;
    });

    it("should return 401 if not authorized", async () => {
        await request(app)
            .put(`/comments/${createdComment.id}`)
            .send({ content: "updated content with valid length 123456" })
            .expect(401);
    });

    it("should return 404 if comment not found", async () => {
        await request(app)
            .put(`/comments/123456789012345678901234`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "valid updated comment content with enough length" })
            .expect(404);
    });

    it("should return 403 if user is not the owner", async () => {
        await request(app)
            .put(`/comments/${createdComment.id}`)
            .set("Authorization", `Bearer ${anotherToken}`)
            .send({ content: "valid updated comment content with enough length" })
            .expect(403);
    });

    it("should return 400 if content is invalid", async () => {
        const invalidBodies = [
            { content: "short" },
            { content: "a".repeat(301) },
        ];

        for (const body of invalidBodies) {
            const res = await request(app)
                .put(`/comments/${createdComment.id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(body)
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    { message: expect.any(String), field: "content" },
                ],
            });
        }
    });

    it("should update comment if user is owner and data is valid", async () => {
        await request(app)
            .put(`/comments/${createdComment.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                content: "this is updated valid comment content with enough length",
            })
            .expect(204);
    });
});

describe("DELETE /comments/:commentId", () => {
    let accessToken: string;
    let anotherToken: string;
    let createdPost: any;
    let createdComment: any;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        const blog = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blog for delete",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const post = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "post for comment",
                shortDescription: "short",
                content: "content",
                blogId: blog.body.id,
            })
            .expect(201);

        createdPost = post.body;

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "owner",
                password: "password",
                email: "owner@test.com",
            })
            .expect(201);

        const loginRes1 = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "owner", password: "password" })
            .expect(200);

        accessToken = loginRes1.body.accessToken;

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "stranger",
                password: "password",
                email: "stranger@test.com",
            })
            .expect(201);

        const loginRes2 = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "stranger", password: "password" })
            .expect(200);

        anotherToken = loginRes2.body.accessToken;

        const comment = await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "this is a valid comment with enough length here" })
            .expect(201);

        createdComment = comment.body;
    });

    it("should return 401 if not authorized", async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}`)
            .expect(401);
    });

    it("should return 404 if comment not found", async () => {
        await request(app)
            .delete(`/comments/123456789012345678901234`)
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(404);
    });

    it("should return 403 if user is not the owner", async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}`)
            .set("Authorization", `Bearer ${anotherToken}`)
            .expect(403);
    });

    it("should delete comment if user is owner", async () => {
        await request(app)
            .delete(`/comments/${createdComment.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(204);

        await request(app)
            .get(`/comments/${createdComment.id}`)
            .expect(404);
    });
});

