"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

export default function CartPage() {
	const router = useRouter();
	const { cart, removeFromCart, clearCart, updateCartItem } = useCart();

	// Calculate total price directly
	const totalPrice = cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);

	if (cart.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-6xl mx-auto px-4 py-8">
					<p className="text-center text-gray-600 py-12">Your cart is empty</p>
					<button
						onClick={() => router.push("/")}
						className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
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

			<main className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow">
							{cart.map((item, idx) => (
								<div
									key={idx}
									className="flex justify-between items-center p-4 border-b last:border-b-0"
								>
									<div>
										<h3 className="font-semibold text-gray-900">{item.item.name}</h3>
										<p className="text-gray-600">₹{item.item.price}</p>
										<p className="text-gray-600">Quantity: {item.quantity}</p>
									</div>
									<button
										onClick={() => removeFromCart(item.id)}
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Cart Summary */}
					<div className="bg-white rounded-lg shadow p-6 h-fit">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Order Summary
						</h2>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between text-gray-700">
								<span>Subtotal:</span>
							<span>₹{totalPrice.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-gray-700">
								<span>Items:</span>
								<span>{cart.length}</span>
							</div>
						</div>
						<div className="border-t pt-4 mb-6">
							<div className="flex justify-between text-lg font-bold text-gray-900">
								<span>Total:</span>
								<span>₹{totalPrice.toFixed(2)}</span>
							</div>
						</div>
						<button
							onClick={() => router.push("/checkout")}
							className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg mb-2"
						>
							Proceed to Checkout
						</button>
						<button
							onClick={() => router.push("/")}
							className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg"
						>
							Continue Shopping
						</button>
					</div>
				</div>

				{/* Clear Cart */}
				<div className="mt-8">
					<button
						onClick={() => clearCart()}
						className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
					>
						Clear Cart
					</button>
				</div>
			</main>
		</div>
	);
}
