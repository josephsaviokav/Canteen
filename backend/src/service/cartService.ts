import { Cart, Item } from '../models';

const insertcartItem = async( userId : string, itemId : string, quantity : number) => {
    const cartItem = await Cart.create({ userId, itemId, quantity });
    return cartItem;
}

const getCartItemsByUserId = async (userId: string) => {
    const cartItems = await Cart.findAll({ 
        where: { userId },
        include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'price', 'imageUrl', 'available']
        }]
    });
    return cartItems;
}

const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    const cartItem = await Cart.findByPk(cartItemId);
    if (!cartItem) {
        throw new Error('Cart item not found');
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
}

const deleteCartItem = async (cartItemId: string) => {
    const cartItem = await Cart.findByPk(cartItemId);
    if (!cartItem) {
        throw new Error('Cart item not found');
    }   
    await cartItem.destroy();
    return;
}

export default {
    insertcartItem,
    getCartItemsByUserId,
    updateCartItemQuantity,
    deleteCartItem
};