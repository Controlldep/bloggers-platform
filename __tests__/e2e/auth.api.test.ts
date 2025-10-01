import request from "supertest";
import {app} from "../../src";

describe("GET /auth/me", () => {
    let accessToken: string;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

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
    });

    it("should return 401 if not authorized", async () => {
        await request(app)
            .get("/auth/me")
            .expect(401);
    });

    it("should return current user if authorized", async () => {
        const res = await request(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body).toEqual({
            email: "user1@test.com",
            login: "user1",
            userId: expect.any(String),
        });
    });
});

describe("POST /auth/login", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        await request(app)
            .post("/users")
            .auth("admin", "qwerty")
            .send({
                login: "user1",
                password: "password",
                email: "user1@test.com",
            })
            .expect(201);
    });

    it("should return 400 if body is invalid", async () => {
        const invalidBodies = [
            {},
            { loginOrEmail: "user1" },
            { password: "password" },
            { loginOrEmail: "", password: "password" },
            { loginOrEmail: "user1", password: "" },
        ];

        for (const body of invalidBodies) {
            const res = await request(app)
                .post("/auth/login")
                .send(body)
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: expect.any(Array),
            });
        }
    });

    it("should return 401 if credentials are wrong", async () => {
        await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "wrong123" })
            .expect(401);

        await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "wrong@email.com", password: "password" })
            .expect(401);
    });

    it("should return 200 and accessToken if credentials are correct", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ loginOrEmail: "user1", password: "password" })
            .expect(200);

        expect(res.body).toEqual({
            accessToken: expect.any(String),
        });
    });
});
