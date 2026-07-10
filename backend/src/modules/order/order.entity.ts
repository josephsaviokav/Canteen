import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database.js";
import { OrderStatus } from "./order.dto.js";

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>>{
    declare orderId: CreationOptional<string>;
    declare userId: string;
    declare totalAmount: number;
    declare placedAt: Date;
    declare status: CreationOptional<OrderStatus>;
}

Order.init({
    orderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    placedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
}, {
    sequelize,
    modelName: "orders",
    timestamps: true,
});

export default Order;