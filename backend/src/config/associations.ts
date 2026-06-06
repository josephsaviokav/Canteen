import User from '../modules/user/user.entity';
import Order from '../modules/order/order.entity';
import OrderItem from '../modules/orderItem/orderItem.entity';
import Cart from '../modules/cart/cart.entity';
import CartItem from '../modules/cartItem/cartItem.entity';
import Item from '../modules/item/item.entity';
import Category from '../modules/category/category.entity';
import Payment from '../modules/payment/payment.entity';

const defineAssociations = () => {

    // User → Orders (one to many)
    User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // User → Cart (one to one)
    User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
    Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // User → Payments (one to many)
    User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
    Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // Order → OrderItems (one to many)
    Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    // Order → Payment (one to one)
    Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
    Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    // Cart → CartItems (one to many)
    Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems' });
    CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

    // Item → OrderItems (one to many)
    Item.hasMany(OrderItem, { foreignKey: 'itemId', as: 'orderItems' });
    OrderItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

    // Item → CartItems (one to many)
    Item.hasMany(CartItem, { foreignKey: 'itemId', as: 'cartItems' });
    CartItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

    // Category → Items (one to many)
    Category.hasMany(Item, { foreignKey: 'categoryId', as: 'items' });
    Item.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

};

export default defineAssociations;