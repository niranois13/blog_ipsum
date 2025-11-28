import {
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/Articles/articleController.js";
import {
    createAdmin,
    getAllUsers,
    getUserById
} from "../controllers/Users/userAdminController.js";
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
        createAdmin(req, res);
    });
    app.get("/api/admin/users", (req, res) => {
        getAllUsers(req, res);
    });
    app.get("/api/admin/users/:id", (req, res) => {
        getUserById(req, res);
    });
    app.delete("/api/admin/users/:id", (req, res) => {
        deleteRegisteredUser(req, res);
    });
    app.patch("/api/admin/users/:id", (req, res) => {
        updateRegisteredUser(req, res);
    });

    /* Articles */
    app.post("/api/admin/articles", (req, res) => {
        createArticle(req, res);
    });
    app.put("/api/admin/articles/:id", (req, res) => {
        updateArticle(req, res);
    });
    app.delete("/api/admin/articles/:id", (req, res) => {
        deleteArticle(req, res);
    });

    /* Comments */
    app.get("/api/admin/comments", (req, res) => {
        getAllComments(req, res);
    });
    app.get("/api/admin/comments/:id", (req, res) => {
        getCommentById(req, res);
    });
    app.delete("/api/admin/comments/:id", (req, res) => {
        deleteCommentById(req, res);
    });
    app.put("/api/admin/comments/:id", (req, res) => {
        updateCommentById(req, res);
    });
}
