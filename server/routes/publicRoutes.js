import {
    getAllArticles,
    getArticleById,
    getHomepageArticles,
} from "../controllers/articleController.js";
import { createComment } from "../controllers/commentController.js";
import { loginUser, logOut, getMe } from "../controllers/authController.js";
import {
    createRegisteredUser,
    deleteRegisteredUser,
    updateRegisteredUser,
} from "../controllers/userPublicController.js";
import { authMiddleware, requireSelf } from "../middlewares/authMiddleware.js";
import { resolveUser } from "../middlewares/visitorIdentityMiddleware.js";
import { preventCommentSpamDoxx } from "../middlewares/commentMiddleware.js";

export default function exportPublicRoutes(app) {
    /* Authentication */
    app.post("/api/login", (req, res) => {
        loginUser(req, res);
    });
    app.post("/api/logout", (req, res) => {
        logOut(req, res);
    });
    app.get("/api/auth/me", (req, res) => {
        getMe(req, res);
    });

    /* Users */
    app.post("/api/users", (req, res) => {
        createRegisteredUser(req, res);
    });
    app.patch("/api/users/:id", authMiddleware, requireSelf, (req, res) => {
        updateRegisteredUser(req, res);
    });
    app.delete("/api/users/:id", authMiddleware, requireSelf, (req, res) => {
        deleteRegisteredUser(req, res);
    });

    /* Articles */
    app.get("/api/articles", (req, res) => {
        getAllArticles(req, res);
    });
    app.get("/api/articles/homepage", (req, res) => {
        getHomepageArticles(req, res);
    });
    app.get("/api/articles/:id", (req, res) => {
        getArticleById(req, res);
    });

    /* Comments */
    app.post(
        "/api/articles/:articleId/comments/",
        resolveUser,
        preventCommentSpamDoxx,
        (req, res) => {
            createComment(req, res);
        }
    );
}
