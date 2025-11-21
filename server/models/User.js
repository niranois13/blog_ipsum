import { DataTypes } from "sequelize";
import BaseModel from "./BaseModel.js";

export default function (sequelize) {
    class User extends BaseModel {}

    User.init(
        {
            ...BaseModel.baseFields,
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
                validate: { isEmail: true },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM("ADMIN", "REGISTERED", "VISITOR"),
                allowNull: false,
                defaultValue: "VISITOR",
            },
            ipHash: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
        },

        {
            sequelize,
            modelName: "User",
            tableName: "Users",
            timestamps: true,
            validate: {
                registeredCredentials() {
                    if (
                        (this.role === "REGISTERED" || this.role === "ADMIN") &&
                        (!this.email || !this.password)
                    ) {
                        throw new Error("Registered and Admin users must have credentials.");
                    }
                },
                visitorNoCrendentials() {
                    if (this.role === "VISITOR" && (this.email || this.password)) {
                        throw new Error("Visitors cannot have credentials.");
                    }
                },
            },
        }
    );

    return User;
}
