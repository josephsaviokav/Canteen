import { CreationOptional, DataTypes, ENUM, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database";

const PaymentMethod = ENUM("CREDIT_CARD", "UPI", "NET_BANKING");
const PaymentStatus = ENUM("PENDING", "COMPLETED", "FAILED");

class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    declare paymentId: CreationOptional<string>;
    declare orderId: string;
    declare userId: string;
    declare paymentMethod: typeof PaymentMethod;
    declare amount: number;
    declare paymentStatus: typeof PaymentStatus;
    declare transactionId: string | null;
}

Payment.init({
    paymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    paymentMethod: {
        type: PaymentMethod,
        allowNull: false,
        defaultValue: "UPI"
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentStatus: {
        type: PaymentStatus,
        allowNull: false,
        defaultValue: "PENDING"
    },transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "payments",
    timestamps: true,
    underscored: true,
});

export default Payment;