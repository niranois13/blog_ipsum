import express from "express";
import cookieParser from "cookie-parser";
import exportPublicRoutes from "../routes/publicRoutes.js";
import exportAdminRoutes from "../routes/adminRoutes.js";

export function createApp(models) {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.locals.models = models;

    exportAdminRoutes(app);
    exportPublicRoutes(app);

    return app;
}
