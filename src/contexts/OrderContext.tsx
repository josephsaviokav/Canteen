"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ordersApi } from "@/lib/api";
import { useCart, CartItem } from "./CartContext";

export interface OrderItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	totalAmount: number;
	status: "pending" | "completed" | "canceled";
	createdAt: Date;
	updatedAt: Date;
}

interface OrderContextType {
	orders: Order[];
	currentOrderItems: CartItem[]; // Cart items as current order
	currentOrderTotal: number; // Total amount of current order
	loading: boolean;
	checkout: (userId: string) => Promise<Order>; // Checkout from cart
	addOrder: (userId: string, items: OrderItem[], totalAmount: number) => Promise<Order>;
	updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
	cancelOrder: (orderId: string) => Promise<void>;
	deleteOrder: (orderId: string) => Promise<void>;
	getOrderById: (orderId: string) => Order | undefined;
	refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const { cart, clearCart } = useCart();

	// Current order items from cart
	const currentOrderItems = cart;
	
	// Calculate total amount from cart items
	const currentOrderTotal = cart.reduce((sum, cartItem) => {
		return sum + (cartItem.item.price * cartItem.quantity);
	}, 0);

	// Load orders from backend on mount
	useEffect(() => {
		refreshOrders();
	}, []);

	const refreshOrders = async () => {
		try {
			setLoading(true);
			const response = await ordersApi.getAll();
			if (response.success) {
				setOrders(response.data);
			}
		} catch (error) {
			console.error("Failed to load orders:", error);
		} finally {
			setLoading(false);
		}
	};

	// Checkout function - creates order from cart
	const checkout = async (userId: string): Promise<Order> => {
		try {
			setLoading(true);
			const response = await ordersApi.checkout(userId);
			if (response.success) {
				const newOrder = response.data;
				setOrders((prev) => [newOrder, ...prev]);
				// Cart will be cleared by the backend
				return newOrder;
			}
			throw new Error(response.message || "Failed to checkout");
		} catch (error) {
			console.error("Failed to checkout:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const addOrder = async (userId: string, items: OrderItem[], totalAmount: number): Promise<Order> => {
		try {
			const response = await ordersApi.create(userId, totalAmount, items);
			if (response.success) {
				const newOrder = response.data;
				setOrders((prev) => [newOrder, ...prev]);
				return newOrder;
			}
			throw new Error(response.message || "Failed to create order");
		} catch (error) {
			console.error("Failed to create order:", error);
			throw error;
		}
	};

	const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
		try {
			console.log(`Updating order ${orderId} to status: ${status}`);
			const response = await ordersApi.updateStatus(orderId, status);
			console.log('Update response:', response);
			if (response.success) {
				setOrders((prev) =>
					prev.map((order) =>
						order.id === orderId
							? { ...order, status, updatedAt: new Date() }
							: order
					)
				);
				console.log('Order status updated successfully');
			} else {
				console.error('Failed to update order:', response.message);
			}
		} catch (error) {
			console.error("Failed to update order:", error);
			throw error;
		}
	};

	const cancelOrder = async (orderId: string) => {
		console.log('Cancel order called for:', orderId);
		try {
			await updateOrderStatus(orderId, "canceled");
		} catch (error) {
			console.error('Cancel order error:', error);
		}
	};

	const deleteOrder = async (orderId: string) => {
		try {
			const response = await ordersApi.delete(orderId);
			if (response.success) {
				setOrders((prev) => prev.filter((order) => order.id !== orderId));
			}
		} catch (error) {
			console.error("Failed to delete order:", error);
			throw error;
		}
	};

	const getOrderById = (orderId: string) => {
		return orders.find((order) => order.id === orderId);
	};

	return (
		<OrderContext.Provider
			value={{
				orders,
				currentOrderItems,
				currentOrderTotal,
				loading,
				checkout,
				addOrder,
				updateOrderStatus,
				cancelOrder,
				deleteOrder,
				getOrderById,
				refreshOrders,
			}}
		>
			{children}
		</OrderContext.Provider>
	);
}

export function useOrder() {
	const context = useContext(OrderContext);
	if (!context) {
		throw new Error("useOrder must be used within OrderProvider");
	}
	return context;
}
