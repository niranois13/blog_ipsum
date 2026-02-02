import request from "supertest";
import { describe, it, beforeAll, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { models } from "../setup.js";
import { createTestAdmin } from "../helpers/createTestAdmin.js";
import { createTestArticle } from "../helpers/createTestArticle.js";

let publicApp;
let admin;
let articleId;

describe("CommentStats", () => {
    beforeAll(async () => {
        publicApp = createApp(models);

        const result = await createTestAdmin(models);
        admin = result.admin;

        const article = await createTestArticle(models, {
            authorId: admin.id,
            title: "Mon article de test",
            summary: "Résumé",
            content: [{ insert: "Contenu de test" }],
            status: "PUBLISHED",
        });
        articleId = article.id;
    });

    /* ------------------------------------------------------------------ */
    /* 🔟 CommentStats */
    /* ------------------------------------------------------------------ */
    it("creates CommentStats on first comment", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "First comment",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(201);

        const visitorCookie = res.headers["set-cookie"];
        expect(visitorCookie).toBeDefined();

        const userId = res.body.comment[0].userId;

        const stats = await models.CommentStats.findOne({ where: { userId } });

        expect(stats).not.toBeNull();
        expect(stats.totalComments).toBe(1);
        expect(stats.lastCommentAt).toBeInstanceOf(Date);
    });

    it("increments totalComments on subsequent comments", async () => {
        const first = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "First comment",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        const visitorCookie = first.headers["set-cookie"];
        const userId = first.body.comment[0].userId;

        const second = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .set("Cookie", visitorCookie)
            .send({
                text: "Second comment",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(second.status).toBe(403);

        const stats = await models.CommentStats.findOne({ where: { userId } });

        expect(stats.totalComments).toBe(2);
    });

    it("increments totalRejected on rejected comment", async () => {
        const first = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "First",
                formLoadedAt: Date.now() - 5000,
                replyToId: null,
            });

        const visitorCookie = first.headers["set-cookie"];

        const [comment] = first.body.comment;
        const userId = comment.userId;
        let stats = await models.CommentStats.findOne({ where: { userId } });

        expect(stats.totalRejected).toBe(0);

        await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .set("Cookie", visitorCookie)
            .send({
                text: "Too fast",
                formLoadedAt: Date.now() - 5000,
                replyToId: null,
            });

        stats = await models.CommentStats.findOne({ where: { userId } });

        expect(stats.totalRejected).toBe(1);
    });

    it("updates lastCommentAt on new valid comment", async () => {
        const first = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "First",
                formLoadedAt: Date.now() - 5000,
                replyToId: null,
            });

        const visitorCookie = first.headers["set-cookie"];

        const [comment] = first.body.comment;
        const userId = comment.userId;
        let stats = await models.CommentStats.findOne({ where: { userId } });

        const firstTimeStamp = stats.lastCommentAt;

        await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .set("Cookie", visitorCookie)
            .send({
                text: "Too fast",
                formLoadedAt: Date.now() - 5000,
                replyToId: null,
            });

        stats = await models.CommentStats.findOne({ where: { userId } });

        const newTimeStamp = stats.lastCommentAt;

        expect(newTimeStamp.getTime()).toBeGreaterThan(firstTimeStamp.getTime());
    });
});
