import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, type Optional } from 'sequelize';
import sequelize from '../../config/database.js';

class Item extends Model<InferAttributes<Item> , InferCreationAttributes<Item>> {
  declare itemId: CreationOptional<string>;
  declare categoryId: string;
  declare itemName: string;
  declare itemDescription: string;
  declare price: number;
  declare imageUrl: string;
  declare stockQuantity: number;
  declare isAvailable: CreationOptional<boolean>;
}

// Initialize the model
Item.init(
  {
    itemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.STRING,
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
  }
);

export default Item;
