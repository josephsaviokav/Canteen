"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "@/contexts/OrderContext";
import { usePayment } from "@/contexts/PaymentContext";
import Header from "@/components/Header";

export default function OrderDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const { getOrderById, updateOrderStatus } = useOrder();
	const { getPaymentByOrderId } = usePayment();
	const orderId = params.id as string;
	const order = getOrderById(orderId);
	const payment = order ? getPaymentByOrderId(order.id) : undefined;
	const paymentSuccess = searchParams.get("payment") === "success";

	const downloadReceipt = () => {
		if (!order || !payment) return;

		const receiptContent = `
FOOD ORDERING APP - ORDER RECEIPT
================================

ORDER ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}

ITEMS:
${order.items
	.map(
		(item) =>
			`- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
	)
	.join("\n")}

TOTAL AMOUNT: ₹${order.totalAmount}

PAYMENT INFORMATION:
Transaction ID: ${payment.transactionId}
Card (Last 4): ****${payment.lastFour}
Status: ${payment.status.toUpperCase()}

ORDER STATUS: ${order.status.toUpperCase()}

Thank you for your order!
		`;

		const element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent)
		);
		element.setAttribute("download", `receipt-${order.id}.txt`);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	if (!order) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-2xl mx-auto px-4 py-8">
					<p className="text-center text-gray-600">Order not found</p>
					<button
						onClick={() => router.push("/orders")}
						className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
					>
						Back to Orders
					</button>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-2xl mx-auto px-4 py-8">
				{paymentSuccess && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
						✓ Payment successful! Your order has been confirmed.
					</div>
				)}

				<div className="bg-white rounded-lg shadow p-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						{order.id}
					</h1>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
						<div>
							<p className="text-sm text-gray-600">Status</p>
							<p className="font-semibold text-gray-900 capitalize">
								{order.status}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Payment</p>
							<p className="font-semibold text-gray-900 capitalize">
								{order.paymentStatus}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Order Date</p>
							<p className="font-semibold text-gray-900">
								{new Date(order.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Total Amount</p>
							<p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
						</div>
					</div>

					{payment && (
						<div className="bg-gray-50 p-4 rounded mb-6">
							<h3 className="font-semibold text-gray-900 mb-2">
								Payment Information
							</h3>
							<p className="text-sm text-gray-600">
								Transaction ID: {payment.transactionId}
							</p>
							<p className="text-sm text-gray-600">
								Card (Last 4): ****{payment.lastFour}
							</p>
						</div>
					)}

					<div className="border-t pt-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Order Items
						</h2>
						<div className="space-y-3">
							{order.items.map((item, idx) => (
								<div
									key={idx}
									className="flex justify-between items-center p-3 bg-gray-50 rounded"
								>
									<div>
										<p className="font-semibold text-gray-900">{item.name}</p>
										<p className="text-sm text-gray-600">
											Qty: {item.quantity}
										</p>
									</div>
									<p className="font-semibold text-gray-900">
										₹{item.price * item.quantity}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="mt-8 flex gap-2 flex-wrap">
						<button
							onClick={() => router.push("/orders")}
							className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg"
						>
							Back to Orders
						</button>
						<button
							onClick={downloadReceipt}
							className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
						>
							Download Receipt
						</button>
						{order.status !== "cancelled" && order.status !== "delivered" && (
							<button
								onClick={() => updateOrderStatus(order.id, "cancelled")}
								className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
							>
								Cancel Order
							</button>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
