import request from "supertest";
import {app} from "../../src";
import {ObjectId} from "mongodb";

describe('GET  /blogs | /blogs/id' , ()=> {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it("should return blog by id with status 200", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "string",
                description: "string",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const createdBlog = createResponse.body;

        const getResponse = await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(200);

        expect(getResponse.body).toEqual(createdBlog);
    });

    it("should return 404 if blog not found", async () => {
        await request(app)
            .get("/blogs/650f3c1a6d6b1c23a9c1a111") // валидный ObjectId, но блога нет
            .expect(404);
    });

    it("should return 200 and blogs array with pagination", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "test",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const createdBlog = createResponse.body;

        const getResponse = await request(app)
            .get("/blogs")
            .expect(200);

        expect(getResponse.body).toMatchObject({
            pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: expect.any(Array),
        });

        expect(getResponse.body.items).toEqual(
            expect.arrayContaining([createdBlog])
        );
    });

    it("should return empty array and pagination fields if no blogs", async () => {
        await request(app).delete("/testing/all-data").expect(204);
        const getResponse = await request(app).get("/blogs").expect(200);

        expect(getResponse.body).toMatchObject({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });

})

describe('POST /blogs' , () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('create blog and should return blog and status 201' , async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({name: "string", description: "string", websiteUrl: "https://byuOGpbR0Xg79A6DSdQrObrZng3H89ZdVczJcTr.1jWJ8AuauUw2djUfrpeu1w6Y4OJ2zQrv7eo1TFzydN3eKwzDu2UL"})
            .expect(201)
        const createdBlog = createResponse.body;

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: "string",
            description: "string",
            websiteUrl: "https://byuOGpbR0Xg79A6DSdQrObrZng3H89ZdVczJcTr.1jWJ8AuauUw2djUfrpeu1w6Y4OJ2zQrv7eo1TFzydN3eKwzDu2UL",
            createdAt: expect.any(String),
            isMembership: false
        })
        await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(200 ,createdBlog)
    })

    const noBody: [any, string][] = [
        [{ description: "desc", websiteUrl: "https://site.com" }, "name"],
        [{ name: "blog", websiteUrl: "https://site.com" }, "description"],
        [{ name: "blog", description: "desc" }, "websiteUrl"],
    ];
    it.each(noBody)("should return 400 if body is missing",
        async (body: any, missingField: string) => {
            const response = await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: missingField,
                    },
                ],
            });
        }
    );

    const invalidBodies = [
        [{ name: "a", description: "desc", websiteUrl: "https://site.com" }, "name"],
        [{ name: "a".repeat(20), description: "desc", websiteUrl: "https://site.com" }, "name"],
        [{ name: "valid", description: "a".repeat(501), websiteUrl: "https://site.com" }, "description"],
        [{ name: "valid", description: "a", websiteUrl: "https://site.com" }, "description"],
        [{ name: "valid", description: "desc", websiteUrl: "invalid-url" }, "websiteUrl"],
    ];
    it.each(invalidBodies)(
        "should return 400 if invalidBodies is invalid",
        async (body, invalidField) => {
            const response = await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: invalidField,
                    },
                ],
            });
        }
    );

    it("should return 401 if no auth header", async () => {
        await request(app)
            .post("/blogs")
            .send({
                name: "validName",
                description: "validDescription",
                websiteUrl: "https://site.com",
            })
            .expect(401);
    });

    it("should return 401 if wrong login/password", async () => {
        await request(app)
            .post("/blogs")
            .auth("admin", "wrongPassword")
            .send({
                name: "validName",
                description: "validDescription",
                websiteUrl: "https://site.com",
            })
            .expect(401);
    });

    const emptyBodies: [any, string][] = [
        [{ name: "   ", description: "valid", websiteUrl: "https://site.com" }, "name"],
        [{ name: "valid", description: "   ", websiteUrl: "https://site.com" }, "description"],
    ];
    it.each(emptyBodies)(
        "should return 400 if body empty/whitespace",
        async (body, field) => {
            const response = await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field,
                    },
                ],
            });
        }
    );
})

describe('UPDATE /blogs/id' , () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it("should update blog by id and return 204", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "old name",
                description: "old desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const blogId = createResponse.body.id;

        await request(app)
            .put(`/blogs/${blogId}`)
            .auth("admin", "qwerty")
            .send({
                name: "new name",
                description: "new desc",
                websiteUrl: "https://site.com/updated",
            })
            .expect(204);

        const getResponse = await request(app).get(`/blogs/${blogId}`).expect(200);
        expect(getResponse.body.name).toBe("new name");
    });

    it("should return 404 if blog id not found", async () => {
        await request(app)
            .put(`/blogs/64f9a1d7a2c2a00000000000`)
            .auth("admin", "qwerty")
            .send({
                name: "new name",
                description: "new desc",
                websiteUrl: "https://site.com",
            })
            .expect(404);
    });

    it("should return 401 if no auth", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "valid",
                description: "valid desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const blogId = createResponse.body.id;

        await request(app)
            .put(`/blogs/${blogId}`)
            .send({
                name: "unauthorized change",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(401);
    });

    const invalidBodies: [any, string][] = [
        [{ name: "a", description: "valid", websiteUrl: "https://site.com" }, "name"],
        [{ name: "a".repeat(20), description: "valid", websiteUrl: "https://site.com" }, "name"],
        [{ name: "   ", description: "valid", websiteUrl: "https://site.com" }, "name"],
        [{ name: "valid", description: "a".repeat(501), websiteUrl: "https://site.com" }, "description"],
        [{ name: "valid", description: "   ", websiteUrl: "https://site.com" }, "description"],
        [{ name: "valid", description: "valid", websiteUrl: "invalid-url" }, "websiteUrl"],
        [{ description: "valid", websiteUrl: "https://site.com" }, "name"],
        [{ name: "valid", websiteUrl: "https://site.com" }, "description"],
        [{ name: "valid", description: "valid" }, "websiteUrl"],
    ];

    it.each(invalidBodies)(
        "should return 400 if body is invalid",
        async (body, invalidField) => {
            const createResponse = await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send({
                    name: "valid",
                    description: "valid desc",
                    websiteUrl: "https://site.com",
                })
                .expect(201);

            const blogId = createResponse.body.id;

            const response = await request(app)
                .put(`/blogs/${blogId}`)
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [
                    { message: expect.any(String), field: invalidField },
                ],
            });
        }
    );
})

describe("DELETE /blogs/:id", () => {

    it("should delete blog by id and return 204", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "to delete",
                description: "blog desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const blogId = createResponse.body.id;

        await request(app)
            .delete(`/blogs/${blogId}`)
            .auth("admin", "qwerty")
            .expect(204);

        await request(app)
            .get(`/blogs/${blogId}`)
            .expect(404);
    });

    it("should return 404 if blog id does not exist", async () => {
        await request(app)
            .delete(`/blogs/64bfcf6c2f9b2563e06c9999`)
            .auth("admin", "qwerty")
            .expect(404);
    });

    it("should return 401 if no auth provided", async () => {
        const createResponse = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "string",
                description: "string",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        const createdBlog = createResponse.body;

        await request(app)
            .delete(`/blogs/${createdBlog.id}`)
            .expect(401);
    });
});

describe("GET /blogs/:blogId/posts", () => {
    let createdBlog: any;
    let createdPosts: any[];

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        const blog = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "Tech Blog",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        createdBlog = blog.body;

        createdPosts = [];
        for (let i = 1; i <= 2; i++) {
            const post = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: `post ${i}`,
                    shortDescription: `short ${i}`,
                    content: `content ${i}`,
                    blogId: createdBlog.id,
                })
                .expect(201);

            createdPosts.push(post.body);
        }
    });

    it("should return 404 if blogId does not exist", async () => {
        await request(app)
            .get(`/blogs/${new ObjectId().toString()}/posts`)
            .expect(404);
    });

    it("should return posts for blog with correct pagination", async () => {
        const res = await request(app)
            .get(`/blogs/${createdBlog.id}/posts`)
            .expect(200);

        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expect.arrayContaining([
                {
                    id: expect.any(String),
                    title: expect.any(String),
                    shortDescription: expect.any(String),
                    content: expect.any(String),
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String),
                },
            ]),
        });
    });

    it("should respect pagination params", async () => {
        const res = await request(app)
            .get(`/blogs/${createdBlog.id}/posts?pageNumber=1&pageSize=1`)
            .expect(200);

        expect(res.body.items.length).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(1);
        expect(res.body.totalCount).toBe(2);
    });
});

describe("POST /blogs/:blogId/posts", () => {
    let createdBlog: any;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        const blog = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
                name: "Main Blog",
                description: "desc",
                websiteUrl: "https://site.com",
            })
            .expect(201);

        createdBlog = blog.body;
    });

    it("should return 401 if no auth", async () => {
        await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                title: "title",
                shortDescription: "short",
                content: "content",
            })
            .expect(401);
    });

    it("should return 404 if blogId not found", async () => {
        await request(app)
            .post(`/blogs/${new ObjectId().toString()}/posts`)
            .auth("admin", "qwerty")
            .send({
                title: "title",
                shortDescription: "short",
                content: "content",
            })
            .expect(404);
    });

    it("should return 400 if invalid body", async () => {
        const invalidBodies = [
            [{ shortDescription: "short", content: "content" }, "title"],
            [{ title: "t".repeat(50), shortDescription: "short", content: "content" }, "title"],
            [{ title: "title", content: "content" }, "shortDescription"],
            [{ title: "title", shortDescription: "short" }, "content"],
        ];

        for (const [body, field] of invalidBodies) {
            const res = await request(app)
                .post(`/blogs/${createdBlog.id}/posts`)
                .auth("admin", "qwerty")
                .send(body)
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    { message: expect.any(String), field },
                ],
            });
        }
    });

    it("should create post for blog", async () => {
        const res = await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .auth("admin", "qwerty")
            .send({
                title: "Post Title",
                shortDescription: "Short description",
                content: "Post content",
            })
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            title: "Post Title",
            shortDescription: "Short description",
            content: "Post content",
            blogId: createdBlog.id,
            blogName: createdBlog.name,
            createdAt: expect.any(String),
        });
    });
});

