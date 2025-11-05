import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

// Define the attributes interface
export interface PaymentAttributes {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  status: 'pending' | 'completed' | 'cancelled';
  transactionId?: string;
  createdAt: Date;
}

// Define creation attributes
export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'status' | 'transactionId'> {}

// Define the Payment model class
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public orderId!: string;
  public amount!: number;
  public paymentMethod!: 'cash' | 'card' | 'upi';
  public status!: 'pending' | 'completed' | 'cancelled';
  public transactionId?: string;
  public readonly createdAt!: Date;
}

// Initialize the model
Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'upi'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: false,
    createdAt: 'createdAt',
    updatedAt: false,
  }
);

export default Payment;
