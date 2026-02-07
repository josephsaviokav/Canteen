"use client";

import { useRouter } from "next/navigation";
import { useOrder } from "@/contexts/OrderContext";
import Header from "@/components/Header";
import { useEffect } from "react";

export default function OrdersPage() {
	const router = useRouter();
	const { orders, cancelOrder, deleteOrder, loading, refreshOrders } = useOrder();

	// Refresh orders on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		refreshOrders();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "canceled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-6xl mx-auto px-4 py-8">
					<p className="text-center text-gray-600">Loading orders...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

				{orders.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-600 mb-4">No orders yet</p>
						<button
							onClick={() => router.push("/")}
							className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
						>
							Start Ordering
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{orders.map((order) => (
							<div
								key={order.id}
								className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
							>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
									<div>
										<h3 className="text-lg font-semibold text-gray-900">
											Order #{order.id.slice(0, 8)}
										</h3>
										<p className="text-sm text-gray-600">
											{new Date(order.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex gap-2 flex-wrap">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
												order.status
											)}`}
										>
											{order.status}
										</span>
									</div>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
									<div className="space-y-1">
										{order.items.map((item, idx) => (
											<p key={idx} className="text-sm text-gray-600">
												{item.name} x{item.quantity} - ₹{item.price * item.quantity}
											</p>
										))}
									</div>
								</div>

								<div className="border-t pt-4 mb-4 flex justify-between items-center">
									<p className="text-lg font-bold text-gray-900">
										Total: ₹{order.totalAmount}
									</p>
								</div>

								<div className="flex gap-2 flex-wrap">
									<button
										onClick={() => router.push(`/orders/${order.id}`)}
										className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
									>
										View Details
									</button>
									{order.status !== "canceled" && order.status !== "completed" && (
										<button
											onClick={async () => await cancelOrder(order.id)}
											className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
										>
											Cancel Order
										</button>
									)}
									<button
										onClick={async () => await deleteOrder(order.id)}
										className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
