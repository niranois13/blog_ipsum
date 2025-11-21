import { DataTypes } from "sequelize";
import BaseModel from "./BaseModel.js";

export default function (sequelize) {
    class Article extends BaseModel {}

    Article.init(
        {
            ...BaseModel.baseFields,
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cover: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { isUrl: true },
            },
            summary: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("PUBLISHED", "DRAFT", "ARCHIVED"),
                allowNull: false,
                defaultValue: "DRAFT",
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    model: "Users",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        },

        {
            sequelize,
            modelName: "Article",
            tableName: "Articles",
            timestamps: true,
        }
    );

    return Article;
}
