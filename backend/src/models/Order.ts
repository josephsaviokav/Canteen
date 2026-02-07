import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes interface
export interface OrderAttributes {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
export interface OrderCreationAttributes 
  extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

// Define the Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId!: string;
  public totalAmount!: number;
  public status!: 'pending' | 'completed' | 'canceled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('totalAmount');
        return value ? parseFloat(value as any) : value;
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'canceled'),
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'orders',
    timestamps: true,
    underscored: false,
  }
);

export default Order;
