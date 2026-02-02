import request from "supertest";
import { describe, it, beforeAll, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { models } from "../setup.js";
import { createTestAdmin } from "../helpers/createTestAdmin.js";

let app;
let admin;

describe("Auth Controller", () => {
    beforeAll(async () => {
        app = createApp(models);

        const res = await createTestAdmin(models);
        admin = res.admin;
    });

    /* ------------------------------------------------------------------ */
    /* LOGIN */
    /* ------------------------------------------------------------------ */

    it("rejects login without credentials", async () => {
        const res = await request(app).post("/api/login").send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/No credentials/i);
    });

    it("rejects login with invalid credentials", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "wrong-password" });

        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/Invalid credentials/i);
    });

    it("logs in user and sets auth cookie", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    /* ------------------------------------------------------------------ */
    /* GET ME */
    /* ------------------------------------------------------------------ */

    it("returns null user when not authenticated", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.status).toBe(200);
        expect(res.body.user).toBeNull();
    });

    it("returns authenticated user when token is valid", async () => {
        const login = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });

        const cookie = login.headers["set-cookie"];
        expect(cookie).toBeDefined();

        const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.id).toBe(admin.id);
    });

    /* ------------------------------------------------------------------ */
    /* LOGOUT */
    /* ------------------------------------------------------------------ */

    it("logs out user and clears auth cookie", async () => {
        const res = await request(app).post("/api/logout");

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/cleared/i);
    });
});

describe("Auth Controller - destuctive", () => {
    beforeAll(async () => {
        await models.User.sequelize.sync({ force: true });

        app = createApp(models);

        const res = await createTestAdmin(models);
        admin = res.admin;
    });

    it("returns 404 when token is valid but user no longer exists", async () => {
        const login = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });

        const cookie = login.headers["set-cookie"];

        await models.User.destroy({ where: { id: admin.id } });

        const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

        expect(res.status).toBe(404);
    });
});
