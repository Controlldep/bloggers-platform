import request from "supertest";
import {app} from "../../src";
import { ObjectId } from "mongodb";

describe("GET /posts", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    it("should return empty array if no posts", async () => {
        const res = await request(app).get("/posts").expect(200);

        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });

    it("should return created post in items", async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blog",
                description: "desc",
                websiteUrl: "https://site.com"
            })
            .expect(201);

        const postRes = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "post1",
                shortDescription: "short",
                content: "content",
                blogId: blogRes.body.id
            })
            .expect(201);

        const res = await request(app).get("/posts").expect(200);

        expect(res.body.totalCount).toBe(1);
        expect(res.body.items[0]).toEqual(postRes.body);
    });

    it("should paginate posts", async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blog2",
                description: "desc",
                websiteUrl: "https://site.com"
            })
            .expect(201);

        for (let i = 0; i < 12; i++) {
            await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: `post${i}`,
                    shortDescription: "short",
                    content: "content",
                    blogId: blogRes.body.id
                })
                .expect(201);
        }

        const res = await request(app)
            .get("/posts?pageNumber=2&pageSize=5")
            .expect(200);

        expect(res.body.page).toBe(2);
        expect(res.body.pageSize).toBe(5);
        expect(res.body.items.length).toBe(5);
        expect(res.body.totalCount).toBe(12 + 1); // с учётом поста из прошлого теста
    });

    it("should sort posts by createdAt desc by default", async () => {
        const res = await request(app).get("/posts").expect(200);
        const items = res.body.items;
        const sorted = [...items].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        expect(items).toEqual(sorted);
    });

    it("should sort posts by createdAt asc", async () => {
        const res = await request(app)
            .get("/posts?sortDirection=asc")
            .expect(200);

        const items = res.body.items;
        const sorted = [...items].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        expect(items).toEqual(sorted);
    });
});

describe("GET /posts/:id", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    let createdPost: any;

    it("should return 404 if post not found", async () => {
        await request(app)
            .get('/posts/64bfcf6c2f9b2563e06c9999')
            .expect(404);
    });


    it("should return 404 if post not found", async () => {
        await request(app)
            .get(`/posts/${new ObjectId().toString()}`)
            .expect(404);
    });

    it("should return created post by id", async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blogForPost",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const postRes = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "title1",
                shortDescription: "short1",
                content: "content1",
                blogId: blogRes.body.id,
            })
            .expect(201);

        createdPost = postRes.body;

        const res = await request(app)
            .get(`/posts/${createdPost.id}`)
            .expect(200);

        expect(res.body).toEqual(createdPost);
    });
});

describe("POST /posts", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    let blog: any;

    beforeAll(async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blogForPosts",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);
        blog = blogRes.body;
    });

    it("should return 401 if no authorization", async () => {
        await request(app)
            .post("/posts")
            .send({
                title: "title",
                shortDescription: "short",
                content: "content",
                blogId: blog.id,
            })
            .expect(401);
    });

    it("should create post with valid data", async () => {
        const res = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "postTitle",
                shortDescription: "short",
                content: "post content",
                blogId: blog.id,
            })
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            title: "postTitle",
            shortDescription: "short",
            content: "post content",
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
        });
    });

    const invalidBodies: [any, string][] = [
        [{ shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
        [{ title: "title", content: "content", blogId: blog?.id }, "shortDescription"],
        [{ title: "title", shortDescription: "short", blogId: blog?.id }, "content"],
        [{ title: "a".repeat(31), shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
        [{ title: "title", shortDescription: "a".repeat(101), content: "content", blogId: blog?.id }, "shortDescription"],
        [{ title: "title", shortDescription: "short", content: "a".repeat(1001), blogId: blog?.id }, "content"],
        [{ title: "   ", shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
    ];

    it.each(invalidBodies)(
        "should return 400 if field %s is invalid",
        async (body, invalidField) => {
            const res = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: invalidField,
                    },
                ],
            });
        }
    );
});

describe("PUT /posts/:id", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    let blog: any;
    let post: any;

    beforeAll(async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blogForUpdate",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        blog = blogRes.body;

        const postRes = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "title1",
                shortDescription: "short1",
                content: "content1",
                blogId: blog.id,
            })
            .expect(201);

        post = postRes.body;
    });

    it("should return 404 if post not found", async () => {
        await request(app)
            .put('/posts/64bfcf6c2f9b2563e06c9999')
            .auth("admin", "qwerty")
            .send({
                title: "newTitle",
                shortDescription: "newShort",
                content: "newContent",
                blogId: blog.id,
            })
            .expect(404);
    });

    it("should return 401 if no authorization", async () => {
        await request(app)
            .put(`/posts/${post.id}`)
            .send({
                title: "newTitle",
                shortDescription: "newShort",
                content: "newContent",
                blogId: blog.id,
            })
            .expect(401);
    });

    it("should return 404 if post not found", async () => {
        await request(app)
            .put(`/posts/${new ObjectId().toString()}`)
            .auth("admin", "qwerty")
            .send({
                title: "newTitle",
                shortDescription: "newShort",
                content: "newContent",
                blogId: blog.id,
            })
            .expect(404);
    });

    it("should return 404 if blogId not found", async () => {
        await request(app)
            .put(`/posts/${post.id}`)
            .auth("admin", "qwerty")
            .send({
                title: "newTitle",
                shortDescription: "newShort",
                content: "newContent",
                blogId: new ObjectId().toString(),
            })
            .expect(404);
    });

    it("should update post with valid data", async () => {
        await request(app)
            .put(`/posts/${post.id}`)
            .auth("admin", "qwerty")
            .send({
                title: "updatedTitle",
                shortDescription: "updatedShort",
                content: "updatedContent",
                blogId: blog.id,
            })
            .expect(204);

        const res = await request(app).get(`/posts/${post.id}`).expect(200);
        expect(res.body.title).toBe("updatedTitle");
    });

    const invalidBodies: [any, string][] = [
        [{ shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
        [{ title: "title", content: "content", blogId: blog?.id }, "shortDescription"],
        [{ title: "title", shortDescription: "short", blogId: blog?.id }, "content"],
        [{ title: "a".repeat(31), shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
        [{ title: "title", shortDescription: "a".repeat(101), content: "content", blogId: blog?.id }, "shortDescription"],
        [{ title: "title", shortDescription: "short", content: "a".repeat(1001), blogId: blog?.id }, "content"],
        [{ title: "   ", shortDescription: "short", content: "content", blogId: blog?.id }, "title"],
    ];

    it.each(invalidBodies)(
        "should return 400 if field %s is invalid",
        async (body, invalidField) => {
            const res = await request(app)
                .put(`/posts/${post.id}`)
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: invalidField,
                    },
                ],
            });
        }
    );
});

describe("DELETE /posts/:id", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    let blog: any;
    let post: any;

    beforeAll(async () => {
        const blogRes = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "blogForDelete",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        blog = blogRes.body;

        const postRes = await request(app)
            .post("/posts")
            .auth("admin", "qwerty")
            .send({
                title: "titleToDelete",
                shortDescription: "short",
                content: "content",
                blogId: blog.id,
            })
            .expect(201);

        post = postRes.body;
    });

    it("should return 401 if no authorization", async () => {
        await request(app).delete(`/posts/${post.id}`).expect(401);
    });

    it("should return 404 if post not found", async () => {
        await request(app)
            .delete('/posts/64bfcf6c2f9b2563e06c9999')
            .auth("admin", "qwerty")
            .expect(404);
    });


    it("should delete post with valid id", async () => {
        await request(app)
            .delete(`/posts/${post.id}`)
            .auth("admin", "qwerty")
            .expect(204);

        await request(app).get(`/posts/${post.id}`).expect(404);
    });
});

describe("GET /posts/:postId/comments", () => {
    let createdPost: any;
    let accessToken: string;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

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

        const loginRes = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "password" })
            .expect(200);

        accessToken = loginRes.body.accessToken;

        await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "this is the first valid comment here!!!" })
            .expect(201);

        await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "this is the second valid comment here!!!" })
            .expect(201);
    });

    it("should return 404 if postId does not exist", async () => {
        await request(app)
            .get(`/posts/${new ObjectId().toString()}/comments`)
            .expect(404);
    });

    it("should return comments with pagination for valid post", async () => {
        const res = await request(app)
            .get(`/posts/${createdPost.id}/comments`)
            .expect(200);

        expect(res.body).toEqual({
            pagesCount: expect.any(Number),
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expect.arrayContaining([
                {
                    id: expect.any(String),
                    content: expect.any(String),
                    commentatorInfo: {
                        userId: expect.any(String),
                        userLogin: "user1",
                    },
                    createdAt: expect.any(String),
                },
            ]),
        });
    });

    it("should respect pagination query params", async () => {
        const res = await request(app)
            .get(`/posts/${createdPost.id}/comments?pageNumber=1&pageSize=1`)
            .expect(200);

        expect(res.body.items.length).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(1);
        expect(res.body.totalCount).toBe(2);
    });
});

describe("POST /posts/:postId/comments", () => {
    let accessToken: string;
    let createdPost: any;

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
                title: "test post",
                shortDescription: "short",
                content: "content",
                blogId: blog.body.id,
            })
            .expect(201);

        createdPost = post.body;

        const user = await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "user1",
                password: "password",
                email: "user1@test.com",
            })
            .expect(201);

        const loginRes = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "password" })
            .expect(200);

        accessToken = loginRes.body.accessToken;
    });

    it("should return 401 if no auth", async () => {
        await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .send({ content: "valid comment content here 12345" })
            .expect(401);
    });

    it("should return 404 if post not found", async () => {
        await request(app)
            .post(`/posts/${new ObjectId().toString()}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "valid comment content here 12345" })
            .expect(404);
    });

    it("should return 400 if content too short or too long", async () => {
        const invalidBodies = [
            { content: "short" },
            { content: "a".repeat(301) },
        ];

        for (const body of invalidBodies) {
            const res = await request(app)
                .post(`/posts/${createdPost.id}/comments`)
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

    it("should create comment with valid data", async () => {
        const res = await request(app)
            .post(`/posts/${createdPost.id}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ content: "this is a valid comment with enough length!" })
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            content: "this is a valid comment with enough length!",
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: "user1",
            },
            createdAt: expect.any(String),
        });
    });
});

