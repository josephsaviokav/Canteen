import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class CartItem extends Model<InferAttributes<CartItem>,InferCreationAttributes<CartItem>>{
    declare cartItemId : CreationOptional<string>;
    declare cartId : string;
    declare itemId : string;
    declare quantity : number;  
}

CartItem.init(
    {
        cartItemId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        cartId: {
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
    },{
        sequelize,
        tableName: 'cart_items',
        timestamps: true,
        underscored: true,
    }    
);

export default CartItem;