import express from "express";
import mysql from "mysql";
import { Sequelize } from "sequelize";

const app = express();
const port = process.env.SERVER_PORT;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
})

async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log("Connected to MySQL");
            return;
        } catch (err) {
            console.log(`MySQL connection failed. Retry ${i + 1}/${retries}...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    console.error("Unable to connect to MySQL after multiple retries.");
}

connectWithRetry();

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});
