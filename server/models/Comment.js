import { DataTypes } from "sequelize";
import BaseModel from "./BaseModel.js";

export default function (sequelize) {
    class Comment extends BaseModel {}

    Comment.init(
        {
            ...BaseModel.baseFields,
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    model: "Users",
                    key: "id",
                },
                allowNull: true,
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            },
            articleId: {
                type: DataTypes.UUID,
                references: {
                    model: "Articles",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            replyToId: {
                type: DataTypes.UUID,
                references: {
                    model: "Comments",
                    key: "id",
                },
                allowNull: true,
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            },
        },

        {
            sequelize,
            modelName: "Comment",
            tableName: "Comments",
            timestamps: true,
        }
    );

    return Comment;
}
