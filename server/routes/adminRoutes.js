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
import { getSusActivity } from "../controllers/CommentStats/commentStats.js";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware.js";

export default function exportAdminRoutes(app) {
    /* Users */
    app.post("/api/admin", authMiddleware, requireAdmin, (req, res) => {
        createAdmin(req, res);
    });
    app.get("/api/admin/users", authMiddleware, requireAdmin, (req, res) => {
        getAllUsers(req, res);
    });
    app.get("/api/admin/users/:id", authMiddleware, requireAdmin, (req, res) => {
        getUserById(req, res);
    });
    app.delete("/api/admin/users/:id", authMiddleware, requireAdmin, (req, res) => {
        deleteRegisteredUser(req, res);
    });
    app.patch("/api/admin/users/:id", authMiddleware, requireAdmin, (req, res) => {
        updateRegisteredUser(req, res);
    });

    /* Articles */
    app.post("/api/admin/articles", authMiddleware, requireAdmin, (req, res) => {
        createArticle(req, res);
    });
    app.put("/api/admin/articles/:id", authMiddleware, requireAdmin, (req, res) => {
        updateArticle(req, res);
    });
    app.delete("/api/admin/articles/:id", authMiddleware, requireAdmin, (req, res) => {
        deleteArticle(req, res);
    });

    /* Comments */
    app.get("/api/admin/comments", authMiddleware, requireAdmin, (req, res) => {
        getAllComments(req, res);
    });
    app.get("/api/admin/comments/:id", authMiddleware, requireAdmin, (req, res) => {
        getCommentById(req, res);
    });
    app.delete("/api/admin/comments/:id", authMiddleware, requireAdmin, (req, res) => {
        deleteCommentById(req, res);
    });
    app.put("/api/admin/comments/:id", authMiddleware, requireAdmin, (req, res) => {
        updateCommentById(req, res);
    });

    /* CommentStats */
    app.get("/api/admin/commentStats", authMiddleware, requireAdmin, (req, res) => {
        getSusActivity(req, res);
    });
}
