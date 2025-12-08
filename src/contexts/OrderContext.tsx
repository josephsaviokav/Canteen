"use client";

import { createContext, useContext, useState } from "react";

export interface OrderItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

export interface Order {
	id: string;
	items: OrderItem[];
	totalAmount: number;
	status: "pending" | "confirmed" | "processing" | "delivered" | "cancelled";
	paymentStatus: "pending" | "completed" | "failed";
	createdAt: Date;
	updatedAt: Date;
}

interface OrderContextType {
	orders: Order[];
	addOrder: (items: OrderItem[], totalAmount: number) => Order;
	updateOrderStatus: (orderId: string, status: Order["status"]) => void;
	cancelOrder: (orderId: string) => void;
	deleteOrder: (orderId: string) => void;
	getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
	const [orders, setOrders] = useState<Order[]>([]);

	const addOrder = (items: OrderItem[], totalAmount: number): Order => {
		const newOrder: Order = {
			id: `ORD-${Date.now()}`,
			items,
			totalAmount,
			status: "pending",
			paymentStatus: "pending",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setOrders((prev) => [newOrder, ...prev]);
		return newOrder;
	};

	const updateOrderStatus = (orderId: string, status: Order["status"]) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? { ...order, status, updatedAt: new Date() }
					: order
			)
		);
	};

	const cancelOrder = (orderId: string) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							status: "cancelled",
							updatedAt: new Date(),
					}
					: order
			)
		);
	};

	const deleteOrder = (orderId: string) => {
		setOrders((prev) => prev.filter((order) => order.id !== orderId));
	};

	const getOrderById = (orderId: string) => {
		return orders.find((order) => order.id === orderId);
	};

	return (
		<OrderContext.Provider
			value={{
				orders,
				addOrder,
				updateOrderStatus,
				cancelOrder,
				deleteOrder,
				getOrderById,
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
