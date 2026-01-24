import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

export interface CartAttributes {
    id: string;
    userId: string;
    itemId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface CartCreationAttributes
    extends Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'> {}   

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: string;
    public userId!: string;
    public itemId!: string;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Cart.init(
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
        itemId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        tableName: 'carts',
        timestamps: true,
        
    }
);
    
export default Cart;