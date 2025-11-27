import {
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/Articles/articleController.js";
import { createAdmin, getAllUsers, getUserById } from "../controllers/Users/userAdminController.js";
import {
    deleteRegisteredUser,
    updateRegisteredUser,
} from "../controllers/Users/userPublicController.js";
import {
    getAllComments,
    getCommentById,
    deleteCommentById,
    updateCommentById,
} from "../controllers/Comments/commentController.js";

export default function exportAdminRoutes(app) {
    /* Users */
    app.post("/api/admin", (req, res) => {
        try {
            createAdmin(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.get("/api/admin/users", (req, res) => {
        try {
            getAllUsers(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.get("/api/admin/users/:id", (req, res) => {
        try {
            getUserById(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.delete("/api/admin/users/:id", (req, res) => {
        try {
            deleteRegisteredUser(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.patch("/api/admin/users/:id", (req, res) => {
        try {
            updateRegisteredUser(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /* Articles */
    app.post("/api/admin/articles", (req, res) => {
        try {
            createArticle(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.put("/api/admin/articles/:id", (req, res) => {
        try {
            updateArticle(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.delete("/api/admin/articles/:id", (req, res) => {
        try {
            deleteArticle(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    /* Comments */
    app.get("/api/admin/comments", (req, res) => {
        try {
            getAllComments(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.get("/api/admin/comments/:id", (req, res) => {
        try {
            getCommentById(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.delete("/api/admin/comments/:id", (req, res) => {
        try {
            deleteCommentById(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    app.put("/api/admin/comments/:id", (req, res) => {
        try {
            updateCommentById(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
