import { DataTypes } from "sequelize";
import BaseModel from "./BaseModel.js";

export default function (sequelize) {
    class CommentStats extends BaseModel {}

    CommentStats.init(
        {
            ...BaseModel.baseFields,
            totalComments: {
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
            },
            totalRejected: {
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
            },
            lastCommentAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                unque: true,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            },
        },

        {
            sequelize,
            modelName: "CommentStats",
            tableName: "CommentStats",
            timestamps: true,
        }
    );

    return CommentStats;
}
