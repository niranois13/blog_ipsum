import request from "supertest";
import { describe, it, beforeAll, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { models } from "../setup.js";
import { createTestAdmin } from "../helpers/createTestAdmin.js";
import { validQuillContent } from "../helpers/quillContent.js";
import { invalidArticleCases } from "./invalidArticleCases.js";

let app;
let publicApp;
let articleId;
let adminCookie;

describe("Articles API", () => {
    beforeAll(async () => {
        app = createApp(models);
        publicApp = createApp(models);

        const { admin } = await createTestAdmin(models);

        const loginRes = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });

        adminCookie = loginRes.headers["set-cookie"];
    });

    it.each(invalidArticleCases)("rejects article creation when $name", async ({ body, error }) => {
        const res = await request(app)
            .post("/api/admin/articles")
            .set("Cookie", adminCookie)
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(error);
    });

    /* ------------------------------------------------------------------ */
    /* CREATE ARTICLE */
    /* ------------------------------------------------------------------ */
    describe("POST /api/admin/articles", () => {
        it("rejects creation without admin", async () => {
            const res = await request(publicApp).post("/api/admin/articles").send({
                title: "Test",
                summary: "Summary",
                content: validQuillContent(),
                status: "DRAFT",
            });

            expect(res.status).toBe(401);
        });

        it("creates article as admin", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "My article",
                    summary: "Short summary",
                    content: validQuillContent(),
                    status: "DRAFT",
                });

            expect(res.status).toBe(201);
            expect(res.body.article).toBeDefined();
            expect(res.body.article.title).toBe("My article");

            articleId = res.body.article.id;
        });

        it("auto-formats title and summary if invalid", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "",
                    summary: "",
                    content: validQuillContent(),
                    status: "DRAFT",
                });

            expect(res.status).toBe(201);
            expect(res.body.article.title).toMatch(/^New article:/);
            expect(res.body.article.summary).toMatch(/Enter a valid summary/);
        });
    });
});

/* ------------------------------------------------------------------ */
/* GET ARTICLES */
/* ------------------------------------------------------------------ */
describe("GET /api/admin/articles", () => {
    it("returns list of articles", async () => {
        const res = await request(publicApp).get("/api/articles");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("GET /api/admin/articles/:id", () => {
    it("returns article by id", async () => {
        const res = await request(publicApp).get(`/api/articles/${articleId}`);

        expect(res.status).toBe(200);
        expect(res.body.article).toBeDefined();
        expect(res.body.article.id).toBe(articleId);
    });

    it("returns 404 for unknown article", async () => {
        const res = await request(publicApp).get("/api/articles/unknown-id");

        expect(res.status).toBe(404);
    });
});

/* ------------------------------------------------------------------ */
/* UPDATE ARTICLE */
/* ------------------------------------------------------------------ */
describe("PUT /api/admin/articles/:id", () => {
    it("rejects update without admin", async () => {
        const res = await request(publicApp)
            .put(`/api/admin/articles/${articleId}`)
            .send({ title: "Updated title" });

        expect(res.status).toBe(401);
    });

    it("updates article as admin", async () => {
        const res = await request(app)
            .put(`/api/admin/articles/${articleId}`)
            .set("Cookie", adminCookie)
            .send({
                title: "Updated title",
                summary: "Updated summary",
                content: validQuillContent(),
                status: "DRAFT",
            });

        expect(res.status).toBe(200);
        expect(res.body.article.title).toBe("Updated title");
    });
});

describe("PATCH /api/admin/articles/:id/archive", () => {
    it("archives article as admin", async () => {
        const res = await request(app)
            .patch(`/api/admin/articles/${articleId}/archive`)
            .set("Cookie", adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.article.status).toBe("ARCHIVED");
    });
});

/* ------------------------------------------------------------------ */
/* DELETE ARTICLE */
/* ------------------------------------------------------------------ */
describe("DELETE /api/admin/articles/:id", () => {
    it("deletes article as admin", async () => {
        const res = await request(app)
            .delete(`/api/admin/articles/${articleId}`)
            .set("Cookie", adminCookie);

        expect(res.status).toBe(200);
    });

    it("returns 404 after deletion", async () => {
        const res = await request(publicApp).get(`/api/admin/articles/${articleId}`);

        expect(res.status).toBe(404);
    });
});

/* ------------------------------------------------------------------ */
/* HOMEPAGE SPECIFICS */
/* ------------------------------------------------------------------ */
describe("Articles API - Homepage specifics", () => {
    beforeAll(async () => {
        app = createApp(models);
        publicApp = createApp(models);
        await models.User.destroy({ where: {} });

        const { admin } = await createTestAdmin(models);

        const loginRes = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });

        adminCookie = loginRes.headers["set-cookie"];

        await models.Article.destroy({ where: {} });
    });

    it("returns 404 if no articles exist", async () => {
        const res = await request(publicApp).get("/api/articles/homepage");
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/No article found/i);
    });

    it("returns only latestArticle if 1 article exists", async () => {
        const articleRes = await request(app)
            .post("/api/admin/articles")
            .set("Cookie", adminCookie)
            .send({
                title: "Article 1",
                summary: "Summary",
                content: validQuillContent(),
                status: "PUBLISHED",
                coverID: "cloudinary://image1",
                coverAlt: "coverAlt1",
            });
        expect(articleRes.status).toBe(201);

        const res = await request(publicApp).get("/api/articles/homepage");
        expect(res.status).toBe(200);
        expect(res.body.latestArticle).toBeDefined();
        expect(res.body.otherLatestArticles).toBeNull();
        expect(res.body.allOtherArticles).toBeNull();
    });

    it("returns latestArticle + otherLatestArticles if 4 articles exist", async () => {
        for (let i = 2; i <= 4; i++) {
            await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: `Article ${i}`,
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "PUBLISHED",
                    coverID: `cloudinary://image${i}`,
                    coverAlt: `coverAlt${i}`,
                });
        }

        const res = await request(publicApp).get("/api/articles/homepage");
        expect(res.status).toBe(200);
        expect(res.body.latestArticle).toBeDefined();
        expect(res.body.otherLatestArticles).toBeDefined();
        expect(res.body.allOtherArticles).toBeNull();
    });

    it("returns all segments if 10 articles exist", async () => {
        for (let i = 5; i <= 10; i++) {
            await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: `Article ${i}`,
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "PUBLISHED",
                    coverID: `cloudinary://image${i}`,
                    coverAlt: `coverAlt${i}`,
                });
        }

        const res = await request(publicApp).get("/api/articles/homepage");
        expect(res.status).toBe(200);
        expect(res.body.latestArticle).toBeDefined();
        expect(res.body.otherLatestArticles).toBeDefined();
        expect(res.body.allOtherArticles).toBeDefined();

        expect(res.body.latestArticle.title).toBe("Article 10");
        expect(res.body.otherLatestArticles.length).toBe(3);
        expect(res.body.allOtherArticles.length).toBe(6);
    });
});
