import { CreationAttributes, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database.js';

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
    declare cartId: CreationOptional<string>;
    declare userId: string;
}

Cart.init(
    {
        cartId: {  
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'carts',
        timestamps: true,
        underscored: true,
    }
);
    
export default Cart;