import express from "express";
import { Sequelize } from "sequelize";
import setupModels from "../models/index.js";
import exportPublicRoutes from "../routes/publicRoutes.js";
import exportAdminRoutes from "../routes/adminRoutes.js";

const app = express();
const port = process.env.SERVER_PORT;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});

async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log("Connected to MySQL");
            return true;
        } catch (error) {
            console.log("MySQL connection failed: ", error.message);
            await new Promise((r) => setTimeout(r, delay));
            return false;
        }
    }

    console.error("Unable to connect to MySQL after multiple retries.");
    return false;
}

async function synchroModels() {
    try {
        const models = setupModels(sequelize);

        await sequelize.sync({ force: true });
        console.log("Models synchronized successfully.");

        app.locals.models = models;

        return true;
    } catch (error) {
        console.error("Model synchronization failed:", error);
        return false;
    }
}

async function startServer() {
    const connected = await connectWithRetry();
    if (!connected)
        return;

    const synchronized = await synchroModels();
    if (!synchronized)
        return;

    app.use(express.json());
    exportAdminRoutes(app)
    exportPublicRoutes(app);

    app.listen(port, () => {
        console.log(`Server up and running on port ${port}`);
    });
}

startServer();
