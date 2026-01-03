import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

// Define the attributes interface
export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
export interface UserCreationAttributes 
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public role!: "customer" | "admin" ;
  public phone?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
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
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
