"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "@/contexts/OrderContext";
import { usePayment } from "@/contexts/PaymentContext";
import Header from "@/components/Header";

export default function OrderDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const { getOrderById, cancelOrder } = useOrder();
	const { getPaymentByOrderId } = usePayment();
	const orderId = params.id as string;
	const order = getOrderById(orderId);
	const payment = order ? getPaymentByOrderId(order.id) : undefined;
	const paymentSuccess = searchParams.get("payment") === "success";

	const canCancel = (order: { status: string }) => {
		return order.status === "pending";
	};

	const handleCancelOrder = async () => {
		if (!order) return;
		
		if (confirm("Are you sure you want to cancel this order?")) {
			try {
				await cancelOrder(order.id);
				alert("Order cancelled successfully!");
			} catch {
				alert("Failed to cancel order. Please try again.");
			}
		}
	};

	const downloadReceipt = () => {
		if (!order) return;

		const receiptContent = `
FOOD ORDERING APP - ORDER RECEIPT
================================

ORDER ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}

ITEMS:
${order.items && order.items.length > 0
	? order.items
		.map(
			(item) =>
				`- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
		)
		.join("\n")
	: 'No items information available'}

TOTAL AMOUNT: ₹${order.totalAmount}

${payment ? `PAYMENT INFORMATION:
Transaction ID: ${payment.transactionId}
Card (Last 4): ****${payment.lastFour}
Status: ${payment.status.toUpperCase()}` : ''}

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
						onClick={() => router.push("/user/orders")}
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
								{order.status}
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
						{order.items && order.items.length > 0 ? (
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
						) : (
							<p className="text-gray-600">No item details available</p>
						)}
					</div>

					<div className="mt-8 flex gap-2 flex-wrap">
						<button
							onClick={() => router.push("/user/orders")}
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
						{canCancel(order) && (
							<button
								onClick={handleCancelOrder}
								className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
							>
								Cancel Order
							</button>
						)}
					</div>

					{/* Cancellation Information */}
					{order.status === "pending" ? (
						<div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
							<p className="text-sm text-yellow-800 flex items-center">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
								</svg>
							You can cancel this order anytime before it&apos;s completed
							</p>
						</div>
					) : order.status === "canceled" ? (
						<div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
							<p className="text-sm text-red-800 flex items-center">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								This order has been cancelled
							</p>
						</div>
					) : order.status === "completed" ? (
						<div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
							<p className="text-sm text-green-800 flex items-center">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								This order has been completed
							</p>
						</div>
					) : null}
				</div>
			</main>
		</div>
	);
}
