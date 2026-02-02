import request from "supertest";
import { describe, it, beforeAll, expect } from "vitest";
import { createApp } from "../../src/app.js";
import { models } from "../setup.js";
import { createTestAdmin } from "../helpers/createTestAdmin.js";
import { createTestArticle } from "../helpers/createTestArticle.js";

let app;
let publicApp;
let admin;
let visitorCookie;
let articleId;
let adminCookie;

describe("Comments API", () => {
    beforeAll(async () => {
        app = createApp(models);
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

        const loginRes = await request(app)
            .post("/api/login")
            .send({ email: admin.email, password: "plain-password" });
        adminCookie = loginRes.headers["set-cookie"];
    });

    /* ------------------------------------------------------------------ */
    /* 1️⃣ Création commentaire par visiteur non authentifié */
    /* ------------------------------------------------------------------ */
    it("creates comment as visitor, creates visitor user, sets visitor cookie", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: "Hello from visitor", replyToId: null, formLoadedAt: Date.now() - 5000 });

        const [comment] = res.body.comment;

        expect(res.status).toBe(201);
        expect(comment).toBeDefined();
        expect(comment.userId).toBeDefined();
        expect(comment.articleId).toBe(articleId);

        visitorCookie = res.headers["set-cookie"];
        expect(visitorCookie).toBeDefined();
    });

    /* ------------------------------------------------------------------ */
    /* 1️⃣ Création commentaire avec un mauvais visitorId */
    /* ------------------------------------------------------------------ */
    it("ignores invalid visitor cookie", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .set("Cookie", "invalid")
            .send({
                text: "Hello",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        const [comment] = res.body.comment;
        expect(res.status).toBe(201);
        expect(comment.userId).toBeDefined();
        expect(comment.articleId).toBe(articleId);

        visitorCookie = res.headers["set-cookie"];
        expect(visitorCookie).toBeDefined();
    });

    /* ------------------------------------------------------------------ */
    /* 2️⃣ Création commentaire par user authentifié */
    /* ------------------------------------------------------------------ */
    it("creates comment as authenticated user", async () => {
        const res = await request(app)
            .post(`/api/articles/${articleId}/comments/`)
            .set("Cookie", adminCookie)
            .send({
                text: "Hello from authenticated user",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        const [comment] = res.body.comment;

        expect(res.status).toBe(201);
        expect(comment.userId).toBeDefined();
        expect(comment.articleId).toBe(articleId);
    });

    /* ------------------------------------------------------------------ */
    /* 3️⃣ Middleware: honeypot */
    /* ------------------------------------------------------------------ */
    it("rejects comment with honeypot filled", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "I am a bot",
                honey: "spam",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/Bot detected/);
    });

    /* ------------------------------------------------------------------ */
    /* 4️⃣ Middleware: email / phone / url filtering */
    /* ------------------------------------------------------------------ */
    it("rejects comment containing email", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Contact me at test@example.com",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cannot contain email/i);
    });

    it("rejects comment containing phone number", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Call me +33612345678",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cannot contain email|phone/i);
    });

    it("rejects comment containing url", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Visit https://example.com",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cannot contain email|phone|url/i);
    });

    /* ------------------------------------------------------------------ */
    /* 5️⃣ Middleware: fast comments */
    /* ------------------------------------------------------------------ */
    it("rejects comment posted too fast", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: "Fast comment", replyToId: null, formLoadedAt: Date.now() });

        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/commenting too fast/i);
    });

    /* ------------------------------------------------------------------ */
    /* 6️⃣ Middleware: rate limiting */
    /* ------------------------------------------------------------------ */
    it("rejects comment if delay between comments too short", async () => {
        const firstRes = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: "First comment", replyToId: null, formLoadedAt: Date.now() - 5000 });

        const visitorCookie = firstRes.headers["set-cookie"];
        expect(visitorCookie).toBeDefined();
        expect(firstRes.status).toBe(201);

        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: "Another comment", replyToId: null, formLoadedAt: Date.now() - 5000 })
            .set("Cookie", visitorCookie);

        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/Delay between two comments too short/i);
    });

    /* ------------------------------------------------------------------ */
    /* 7️⃣ Réponse à un commentaire */
    /* ------------------------------------------------------------------ */
    it("creates a reply to a comment", async () => {
        // Récupérer un commentaire existant
        const parentCommentId = (await models.Comment.findOne()).id;

        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Reply comment",
                replyToId: parentCommentId,
                formLoadedAt: Date.now() - 5000,
            });

        const [comment] = res.body.comment;
        expect(res.status).toBe(201);
        expect(comment.replyToId).toBe(parentCommentId);
    });

    it("builds deep commentTree with nested replies", async () => {
        const rootRes = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Root comment",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        const rootComment = rootRes.body.comment[0];

        const reply1Res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Reply level 1",
                replyToId: rootComment.id,
                formLoadedAt: Date.now() - 5000,
            });

        const reply1 = reply1Res.body.comment[0];

        await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Reply level 2",
                replyToId: reply1.id,
                formLoadedAt: Date.now() - 5000,
            });

        const articleRes = await request(publicApp).get(`/api/articles/${articleId}`);

        const tree = articleRes.body.commentTree;

        const rootNode = tree.find((c) => c.id === rootComment.id);
        expect(rootNode).toBeDefined();
        expect(rootNode.replies.length).toBe(1);

        const replyNode = rootNode.replies[0];
        expect(replyNode.id).toBe(reply1.id);
        expect(replyNode.replies.length).toBe(1);

        expect(replyNode.replies[0].text).toBe("Reply level 2");
    });

    /* ------------------------------------------------------------------ */
    /* 8️⃣ Récupération article avec commentTree */
    /* ------------------------------------------------------------------ */
    it("retrieves article with commentTree", async () => {
        const res = await request(publicApp).get(`/api/articles/${articleId}`);

        expect(res.status).toBe(200);
        expect(res.body.article).toBeDefined();
        expect(res.body.commentTree).toBeInstanceOf(Array);
        if (res.body.commentTree.length > 0) {
            expect(res.body.commentTree[0].replies).toBeDefined();
        }
    });

    it("deletes all comments when article is deleted", async () => {
        const article = await createTestArticle(models, {
            authorId: admin.id,
            title: "To be deleted",
            summary: "To be deleted",
            content: [{ insert: "To be deleted" }],
            status: "PUBLISHED",
        });

        const commentRes = await request(publicApp)
            .post(`/api/articles/${article.id}/comments/`)
            .send({
                text: "Comment to be deleted",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        const commentId = commentRes.body.comment[0].id;

        const deleteRes = await request(app)
            .delete(`/api/admin/articles/${article.id}`)
            .set("Cookie", adminCookie);

        expect(deleteRes.status).toBe(200);

        const comment = await models.Comment.findByPk(commentId);
        expect(comment).toBeNull();
    });

    /* ------------------------------------------------------------------ */
    /* 9️⃣ Cas limite: article inexistant */
    /* ------------------------------------------------------------------ */
    it("returns 404 for non-existing article", async () => {
        const res = await request(publicApp).get("/api/articles/non-existent-id");
        expect(res.status).toBe(404);
    });

    /* ------------------------------------------------------------------ */
    /* 9️⃣ Cas limite: parentId inexistant */
    /* ------------------------------------------------------------------ */
    it("rejects reply to non-existing comment", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({
                text: "Reply",
                replyToId: "non-existent-id",
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(400);
    });

    /* ------------------------------------------------------------------ */
    /* 9️⃣ Cas limite: comment on another articleId */
    /* ------------------------------------------------------------------ */
    it("rejects reply to comment from another article", async () => {
        const firstArticle = await createTestArticle(models, {
            authorId: admin.id,
            title: "First",
            summary: "First",
            content: [{ insert: "First" }],
            status: "PUBLISHED",
        });

        const commentFirstArticle = await request(publicApp)
            .post(`/api/articles/${firstArticle.id}/comments/`)
            .send({
                text: "First comment",
                replyToId: null,
                formLoadedAt: Date.now() - 5000,
            });

        expect(commentFirstArticle.status).toBe(201);

        const otherArticle = await createTestArticle(models, {
            authorId: admin.id,
            title: "Other",
            summary: "Other",
            content: [{ insert: "Other" }],
            status: "PUBLISHED",
        });

        const [comment] = commentFirstArticle.body.comment;
        const parentComment = comment.id;

        const res = await request(publicApp)
            .post(`/api/articles/${otherArticle.id}/comments/`)
            .send({
                text: "Invalid reply",
                replyToId: parentComment.id,
                formLoadedAt: Date.now() - 5000,
            });

        expect(res.status).toBe(400);
    });
    /* ------------------------------------------------------------------ */
    /* 🔟 Cas limite: commentaire invalide */
    /* ------------------------------------------------------------------ */
    it("returns 400 for invalid comment format", async () => {
        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: "", replyToId: null, formLoadedAt: Date.now() - 5000 });

        expect(res.status).toBe(400);
    });

    it("rejects comment longer than 1000 characters", async () => {
        const longText = "a".repeat(1001);

        const res = await request(publicApp)
            .post(`/api/articles/${articleId}/comments/`)
            .send({ text: longText, replyToId: null, formLoadedAt: Date.now() - 5000 });

        expect(res.status).toBe(400);
        expect(res.body).toBe("A comment must have between 1 and 1000 characters.");
    });
});
