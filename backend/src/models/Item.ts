import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes interface
export interface ItemAttributes {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
export interface ItemCreationAttributes 
  extends Optional<ItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'available'> {}

// Define the Item model class
class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: string;
  public name!: string;
  public price!: number;
  public imageUrl!: string;
  public available!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Item.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
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
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'items',
    timestamps: true,
    underscored: false,
  }
);

export default Item;
