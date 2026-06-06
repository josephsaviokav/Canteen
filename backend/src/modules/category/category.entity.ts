import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database";

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare categoryId: CreationOptional<string>;
    declare categoryName: string;
    declare categoryDescription: string;
}

Category.init(
    {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{
        sequelize,
        tableName: 'categories',
        timestamps: true,
        underscored: true,
    }
)

export default Category;