import { Sequelize } from "sequelize";
import setupModels from "../models/index.js";
import { createApp } from "./app.js";

const port = process.env.SERVER_PORT || 4000;

async function startServer() {
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: "mysql",
            logging: false,
        }
    );

    const models = setupModels(sequelize);

    await sequelize.sync();

    const app = createApp(models);

    if (process.env.NODE_ENV !== "test") {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }

    return { app, sequelize, models };
}

export default startServer();
