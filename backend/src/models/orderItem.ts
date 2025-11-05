import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

// Define the attributes interface
export interface OrderItemAttributes {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Define creation attributes
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

// Define the OrderItem model class
class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: string;
  public orderId!: string;
  public itemId!: string;
  public quantity!: number;
  public price!: number;
  public subtotal!: number;
}

// Initialize the model
OrderItem.init(
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
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orderItem',
    timestamps: false,
  }
);

export default OrderItem;
