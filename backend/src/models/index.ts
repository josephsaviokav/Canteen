import User from "./User";
import Item from "./Item";
import Order from "./Order";
import OrderItem from "./OrderItem";
import Payment from "./Payment";
import Cart from "./Cart";

// Define associations
Order.hasOne(Payment, {
  foreignKey: 'orderId',
  as: 'payment',
});

Payment.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
});

// OrderItem associations
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

Item.hasMany(OrderItem, {
  foreignKey: 'itemId',
  as: 'orderItems',
});

OrderItem.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

// Cart associations
User.hasMany(Cart, {
  foreignKey: 'userId',
  as: 'cartItems',
});

Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Item.hasMany(Cart, {
  foreignKey: 'itemId',
  as: 'cartItems',
});

Cart.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

// Export all models
export {
  User,
  Item,
  Order,
  OrderItem,
  Payment,
  Cart,
};