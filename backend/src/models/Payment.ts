import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PaymentAttributes {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  lastFour: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreationAttributes 
  extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public orderId!: string;
  public amount!: number;
  public status!: 'pending' | 'completed' | 'failed';
  public transactionId!: string;
  public lastFour!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('amount');
        return value ? parseFloat(value as any) : value;
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    lastFour: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
);

export default Payment;
