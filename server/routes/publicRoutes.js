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
        try {
            createRegisteredUser(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.patch("/api/users/:id", (req, res) => {
        try {
            updateRegisteredUser(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.delete("/api/users/:id", (req, res) => {
        try {
            deleteRegisteredUser(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /* Articles */
    app.get("/api/articles", (req, res) => {
        try {
            getAllArticles(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.get("/api/articles/:id", (req, res) => {
        try {
            getArticleById(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /* Comments */
    app.post("/api/articles/:articleId/comments/", (req, res) => {
        try {
            createComment(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
