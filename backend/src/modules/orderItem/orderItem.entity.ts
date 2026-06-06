import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database";

class OrderItem extends Model<InferAttributes<OrderItem>,InferCreationAttributes<OrderItem>>{
    declare orderItemId: CreationOptional<string>;
    declare orderId: string;
    declare itemId: string;
    declare quantity: number;
    declare unitPrice: number;
    declare subtotal: number;
}

OrderItem.init({
    orderItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    itemId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "order_items",
    timestamps: true,
    underscored: true
});

export default OrderItem;