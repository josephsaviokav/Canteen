import { DataTypes, Model,type Optional } from 'sequelize';
import sequelize from '../config/database.js'; // We'll create this next

// Define the attributes interface
export interface ItemAttributes {
  id: string;
  name: string;
  price: number;
}

// Define creation attributes (id is auto-generated)
export interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

// Define the Item model class
class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: string;
  public name!: string;
  public price!: number;
}

// Initialize the model
Item.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: false,
  }
);

export default Item;