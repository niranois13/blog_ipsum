import { Sequelize } from "sequelize";
import setupModels from "../../models/index.js";

export async function initTestDB() {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });

    const models = setupModels(sequelize);

    await sequelize.query("PRAGMA foreign_keys = ON");
    await sequelize.sync({ force: true });

    return { sequelize, models };
}

export async function teardownTestDB(sequelize) {
    await sequelize.close();
}
