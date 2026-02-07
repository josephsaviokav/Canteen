import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes interface
export interface OrderItemAttributes {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  subTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
export interface OrderItemCreationAttributes 
  extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the OrderItem model class
class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: string;
  public orderId!: string;
  public itemId!: string;
  public quantity!: number;
  public price!: number;
  public subTotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
OrderItem.init(
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
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('price');
        return value ? parseFloat(value as any) : value;
      },
    },
    subTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue('subTotal');
        return value ? parseFloat(value as any) : value;
      },
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
    tableName: 'orderItems',
    timestamps: true,
    underscored: false,
  }
);

export default OrderItem;
