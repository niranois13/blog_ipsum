import { getAllArticles, getArticleById } from "../controllers/Articles/articleController.js";
import { createComment } from "../controllers/Comments/commentController.js";
import {
    createRegisteredUser,
    deleteRegisteredUser,
    updateRegisteredUser,
} from "../controllers/Users/userPublicController.js";

export default function exportPublicRoutes(app) {
    /* Users */
    app.post("/api/users", (req, res) => {
        createRegisteredUser(req, res);
    });
    app.patch("/api/users/:id", (req, res) => {
        updateRegisteredUser(req, res);
    });
    app.delete("/api/users/:id", (req, res) => {
        deleteRegisteredUser(req, res);
    });

    /* Articles */
    app.get("/api/articles", (req, res) => {
        getAllArticles(req, res);
    });
    app.get("/api/articles/:id", (req, res) => {
        getArticleById(req, res);
    });

    /* Comments */
    app.post("/api/articles/:articleId/comments/", (req, res) => {
        createComment(req, res);
    });
}
