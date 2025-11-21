import { Model, DataTypes } from "sequelize";

export default class BaseModel extends Model {
    static baseFields = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    };
}
