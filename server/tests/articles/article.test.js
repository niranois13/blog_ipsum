import request from "supertest";
import { describe, it, beforeAll, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { models } from "../setup.js";
import { createTestAdmin } from "../helpers/createTestAdmin.js";
import { validQuillContent, invalidQuillContent } from "../helpers/quillContent.js";

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

        it("rejects invalid quill content", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Invalid content",
                    summary: "Summary",
                    content: invalidQuillContent(),
                    status: "DRAFT",
                });

            expect(res.status).toBe(400);
        });

        it("rejects stringified invalid JSON content", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Bad JSON",
                    summary: "Oops",
                    content: "{not-json}",
                    status: "DRAFT",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Invalid content format/i);
        });

        it("rejects invalid article status", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Bad status",
                    summary: "Test",
                    content: validQuillContent(),
                    status: "DELETED",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Invalid status/i);
        });

        it("auto-formats title and summary if invalid", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "", // invalide
                    summary: "", // invalide
                    content: validQuillContent(),
                    status: "DRAFT",
                });

            expect(res.status).toBe(201);
            expect(res.body.article.title).toMatch(/^New article:/);
            expect(res.body.article.summary).toMatch(/Enter a valid summary/);
        });

        it("rejects published article without cover", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Published article",
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "PUBLISHED",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Cover is required/i);
        });

        it("rejects draft article with invalid cover", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "draft article",
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "DRAFT",
                    coverID: 42,
                    coverAlt: "coverAlt",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/valid Cloudinary URL/i);
        });

        it("rejects draft with cover but missing alt", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Draft article",
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "DRAFT",
                    coverID: "cloudinary://image",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/alt field/i);
        });

        it("rejects published with cover but missing alt", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Published article",
                    summary: "Summary",
                    content: validQuillContent(),
                    status: "PUBLISHED",
                    coverID: "cloudinary://image",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/alt field/i);
        });

        it("rejects an article without status", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Draft article",
                    summary: "Summary",
                    content: validQuillContent(),
                    coverID: "cloudinary://image",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Missing Parameters/i);
        });

        it("rejects an article without content", async () => {
            const res = await request(app)
                .post("/api/admin/articles")
                .set("Cookie", adminCookie)
                .send({
                    title: "Draft article",
                    summary: "Summary",
                    status: "DRAFT",
                    coverID: "cloudinary://image",
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Missing Parameters/i);
        });
    });
});

/* ------------------------------------------------------------------ */
/* GET ALL ARTICLES */
/* ------------------------------------------------------------------ */
describe("GET /api/admin/articles", () => {
    it("returns list of articles", async () => {
        const res = await request(publicApp).get("/api/articles");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

/* ------------------------------------------------------------------ */
/* GET ARTICLE BY ID */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* ARCHIVE ARTICLE */
/* ------------------------------------------------------------------ */
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
