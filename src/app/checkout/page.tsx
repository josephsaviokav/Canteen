"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { usePayment } from "@/contexts/PaymentContext";
import { processPayment, processUpiPayment, PaymentDetails, UpiDetails } from "@/services/paymentService";
import { TEST_CARDS } from "@/services/testCards";
import Header from "@/components/Header";

type PaymentMethod = "card" | "upi";

export default function CheckoutPage() {
	const router = useRouter();
	const { user } = useAuth();
	const { cart, clearCart } = useCart();
	const { currentOrderItems, currentOrderTotal, checkout, updateOrderStatus } = useOrder();
	const { addPayment } = usePayment();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [paymentAttempts, setPaymentAttempts] = useState(0);
	const [showTestCards, setShowTestCards] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

	const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholder: "",
	});

	const [upiDetails, setUpiDetails] = useState<UpiDetails>({
		upiId: "",
	});

	const totalAmount = currentOrderTotal;

	const handlePaymentChange = (field: keyof PaymentDetails, value: string) => {
		setPaymentDetails((prev) => ({ ...prev, [field]: value }));
	};

	const fillTestCard = (cardType: keyof typeof TEST_CARDS) => {
		const testCard = TEST_CARDS[cardType];
		setPaymentDetails({
			cardNumber: testCard.number,
			expiryDate: testCard.expiry,
			cvv: testCard.cvv,
			cardholder: testCard.name,
		});
	};

	const handlePayment = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!user) {
			setError("You must be logged in to complete checkout");
			setLoading(false);
			return;
		}

		const userid : string = user.id!;

		try {
			// Create order from cart items in backend
			const order = await checkout(userid);

			if (!order) {
				throw new Error("Failed to create order");
			}

			// Process payment based on selected method
			let response;
			let paymentInfo = "";
			
			if (paymentMethod === "card") {
				response = await processPayment(totalAmount, paymentDetails);
				paymentInfo = paymentDetails.cardNumber.slice(-4);
			} else {
				response = await processUpiPayment(totalAmount, upiDetails);
				paymentInfo = upiDetails.upiId;
			}

			if (response.success && response.transactionId) {
				// Record payment locally
				addPayment(order.id, totalAmount, response.transactionId, paymentInfo);
				
				// Update order status in backend
				await updateOrderStatus(order.id, "completed");

				clearCart();
				setPaymentAttempts(0);
				router.push(`/orders/${order.id}?payment=success`);
			} else {
				// Payment failed, cancel the order
				await updateOrderStatus(order.id, "canceled");
				setError(response.message);
				setPaymentAttempts((prev) => prev + 1);
				
				if (paymentAttempts >= 2) {
					setError(response.message + " (3 attempts failed)");
				}
			}
		} catch (err) {
			setError("Payment failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (cart.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-2xl mx-auto px-4 py-8">
					<p className="text-center text-gray-600">Your cart is empty</p>
					<button
						onClick={() => router.push("/")}
						className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
					>
						Continue Shopping
					</button>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-2xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Order Summary */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Order Summary
						</h2>
						<div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
							{cart.map((item, idx) => (
								<div
									key={idx}
									className="flex justify-between text-gray-700"
								>
									<span>{item.item.name}</span>
									<span>₹{item.item.price}</span>
								</div>
							))}
						</div>
						<div className="border-t pt-4 text-xl font-bold text-gray-900">
							Total: ₹{totalAmount}
						</div>
					</div>

					{/* Payment Form */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Payment Details
						</h2>

						{/* Payment Method Selector */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Select Payment Method
							</label>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() => setPaymentMethod("card")}
									className={`p-4 border-2 rounded-lg transition-all ${
										paymentMethod === "card"
											? "border-green-500 bg-green-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
								>
									<div className="flex flex-col items-center">
										<svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
										</svg>
										<span className="font-medium text-sm">Credit/Debit Card</span>
									</div>
								</button>
								<button
									type="button"
									onClick={() => setPaymentMethod("upi")}
									className={`p-4 border-2 rounded-lg transition-all ${
										paymentMethod === "upi"
											? "border-green-500 bg-green-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
								>
									<div className="flex flex-col items-center">
										<svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span className="font-medium text-sm">UPI</span>
									</div>
								</button>
							</div>
						</div>

						{/* Card Payment Form */}
						{paymentMethod === "card" && (
							<>
								{/* Test Cards Info */}
								<button
									type="button"
									onClick={() => setShowTestCards(!showTestCards)}
									className="text-sm text-blue-600 hover:text-blue-800 mb-4 font-medium"
								>
									{showTestCards ? "Hide" : "Show"} Test Cards
								</button>

								{showTestCards && (
									<div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-sm">
										<p className="font-semibold text-blue-900 mb-2">Test Cards:</p>
										<div className="space-y-2">
											<button
												type="button"
												onClick={() => fillTestCard("SUCCESS")}
												className="block w-full text-left p-2 bg-green-100 hover:bg-green-200 rounded text-green-800"
											>
												✓ Success: 4532 0151 1283 0366
											</button>
											<button
												type="button"
												onClick={() => fillTestCard("DECLINED")}
												className="block w-full text-left p-2 bg-red-100 hover:bg-red-200 rounded text-red-800"
											>
												✗ Declined: 5425 2330 1010 3442
											</button>
											<button
												type="button"
												onClick={() => fillTestCard("EXPIRED")}
												className="block w-full text-left p-2 bg-yellow-100 hover:bg-yellow-200 rounded text-yellow-800"
											>
												⚠ Expired: 4111 1111 1111 1111
											</button>
										</div>
									</div>
								)}
							</>
						)}

						{/* UPI Info */}
						{paymentMethod === "upi" && (
							<div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4 text-sm">
								<p className="font-semibold text-purple-900 mb-2">Test UPI IDs:</p>
								<div className="space-y-1 text-purple-800">
									<p>✓ test@paytm</p>
									<p>✓ demo@googlepay</p>
									<p>✓ success@phonepe</p>
								</div>
							</div>
						)}

						<form onSubmit={handlePayment} className="space-y-4">
							{error && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
									⚠️ {error}
								</div>
							)}

							{paymentAttempts > 0 && (
								<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
									Attempt {paymentAttempts}/3
								</div>
							)}

							{/* Card Payment Fields */}
							{paymentMethod === "card" && (
								<>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Cardholder Name
										</label>
										<input
											type="text"
											onChange={(e) =>
												handlePaymentChange("cardholder", e.target.value)
											}
											placeholder="John Doe"
											defaultValue="John Doe"
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Card Number
										</label>
										<input
											type="text"
											defaultValue="4532015112830366"
											onChange={(e) => {
												const value = e.target.value.replace(/\D/g, "").slice(0, 16);
												handlePaymentChange("cardNumber", value);
											}}
											placeholder="1234 5678 9012 3456"
											maxLength={16}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
											required
										/>
										<p className="text-xs text-gray-500 mt-1">16 digits required</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Expiry Date (MM/YY)
											</label>
											<input
												type="text"
												value={paymentDetails.expiryDate}
												onChange={(e) => {
													let value = e.target.value.replace(/\D/g, "");
													if (value.length >= 2) {
														value = value.slice(0, 2) + "/" + value.slice(2, 4);
													}
													handlePaymentChange("expiryDate", value);
												}}
												placeholder="12/25"
												maxLength={5}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												CVV
											</label>
											<input
												type="text"
												value={paymentDetails.cvv}
												onChange={(e) => {
													const value = e.target.value.replace(/\D/g, "").slice(0, 3);
													handlePaymentChange("cvv", value);
												}}
												placeholder="123"
												maxLength={3}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
												required
											/>
										</div>
									</div>
								</>
							)}

							{/* UPI Payment Fields */}
							{paymentMethod === "upi" && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										UPI ID
									</label>
									<div className="relative">
										<input
											type="text"
											value={upiDetails.upiId}
											onChange={(e) =>
												setUpiDetails({ upiId: e.target.value.toLowerCase() })
											}
											placeholder="yourname@paytm"
											className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
											required
										/>
										<svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
										</svg>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Enter your UPI ID (e.g., username@paytm, username@googlepay)
									</p>
									<div className="mt-3 flex flex-wrap gap-2">
										<span className="text-xs font-medium text-gray-600">Popular UPI Apps:</span>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
											@paytm
										</span>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
											@googlepay
										</span>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
											@phonepe
										</span>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
											@ybl
										</span>
									</div>
								</div>
							)}

							<button
								type="submit"
								disabled={loading || paymentAttempts >= 3}
								className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
							>
								{loading
									? "Processing..."
									: paymentAttempts >= 3
									? "Maximum attempts reached"
									: `Pay ₹${totalAmount} via ${paymentMethod === "card" ? "Card" : "UPI"}`}
							</button>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}
