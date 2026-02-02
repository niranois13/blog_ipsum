import { beforeAll, afterAll } from "vitest";
import { initTestDB, teardownTestDB } from "./helpers/initDB";
import dotenv from "dotenv";

dotenv.config();

let sequelize;
let models;

beforeAll(async () => {
    const db = await initTestDB();
    sequelize = db.sequelize;
    models = db.models;
});

afterAll(async () => {
    await teardownTestDB(sequelize);
});

export { sequelize, models };
