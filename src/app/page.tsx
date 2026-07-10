"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header"; 
import { useState, useEffect } from "react";
import { itemsApi } from "@/lib/api";

// Define the Item type based on your backend model
export interface itemType {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export default function Home() {
	const router = useRouter();
	const { addToCart, cart } = useCart();
	const { user, loading: authLoading } = useAuth();
	const [menuItems, setMenuItems] = useState<itemType[]>([]);
	const [loading, setLoading] = useState(true);
	const [quantities, setQuantities] = useState<Record<string, number>>({});
	const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
	const [selectedCategory, setSelectedCategory] = useState<string>("All");

	// Redirect admin users to their dashboard
	useEffect(() => {
		if (!authLoading && user && user.role === "admin") {
			router.push("/admin/dashboard");
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const data = await itemsApi.getAll();
				setMenuItems(data);

				console.log("Fetched menu items:", data);
				
				// Initialize quantities to 1 for all available items
				const initialQuantities: Record<string, number> = {};
				data.rows.forEach((item: itemType) => {
					if (item.available) {
						initialQuantities[item.id] = 1;
					}
				});
				setQuantities(initialQuantities);
			} catch (error) {
				console.error("Failed to fetch menu items:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchItems();
	}, []);

	//const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

	// const filteredItems =
	// 	selectedCategory === "All"
	// 		? menuItems
	// 		: menuItems.filter((item) => item.category === selectedCategory);

	const handleQuantityChange = (itemId: string, change: number) => {
		setQuantities((prev) => {
			const currentQty = prev[itemId] || 0;
			const newQty = Math.max(0, currentQty + change);
			return { ...prev, [itemId]: newQty };
		});
	};

	const handleAddToCart = async (item: itemType) => {
		const quantity = quantities[item.id] || 1;

		try {
			// Get userId from localStorage
			const userString = localStorage.getItem("user");
			console.log("User from localStorage:", userString);
			if (!userString) {
				router.push("/login");
				return;
			}
			const user = JSON.parse(userString);

			// Call addToCart with the authenticated user id
			await addToCart(user.userId, item.id, quantity);

			// Reset quantity and show success feedback
			setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
			setAddedItems((prev) => ({ ...prev, [item.id]: true }));
			setTimeout(() => {
				setAddedItems((prev) => ({ ...prev, [item.id]: false }));
			}, 2000);
		} catch (error) {
			console.error("Failed to add item to cart:", error);
			alert("Failed to add item to cart. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900">Menu</h1>
					{cart.length > 0 && (
						<button
							onClick={() => router.push("/checkout")}
							className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
						>
							Checkout ({cart.length})
						</button>
					)}
				</div>

				{/* Category Filter */}
				{/* <div className="mb-8">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
					<div className="flex flex-wrap gap-3">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									selectedCategory === category
										? "bg-green-500 text-white"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div> */}

				{loading ? (
					<div className="text-center py-12">
						<p className="text-xl text-gray-600">Loading menu...</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{menuItems.map((item: itemType) => {
						const quantity = quantities[item.id] || 0;
						const isAdded = addedItems[item.id];

						return (
							<div
								key={item.id}
								className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${!item.available ? 'opacity-75' : ''}`}
							>
								<div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
									<Image
										src={item.imageUrl}
										alt={item.name}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										priority={false}
										onError={(e) => {
											e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
										}}
									/>
									{!item.available && (
										<div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
											<span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-lg">
												NOT AVAILABLE
											</span>
										</div>
									)}
								</div>
								<div className="p-4">
									{/* <p className="text-xs text-green-600 font-semibold mb-1">
										{item.category}
									</p> */}
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{item.name}
									</h3>
									<p className="text-gray-700 font-medium mb-3">
										₹{item.price}
									</p>

									{/* Quantity Controls */}
									<div className="flex items-center gap-3 mb-3">
										<button
											onClick={() => handleQuantityChange(item.id, -1)}
											disabled={quantity === 0 || !item.available}
											className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 text-gray-700"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 12H4"
												/>
											</svg>
										</button>

										<span className="font-semibold text-gray-900 w-12 text-center text-lg">
											{quantity}
										</span>

										<button
											onClick={() => handleQuantityChange(item.id, 1)}
											disabled={!item.available}
											className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 text-gray-700"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 4v16m8-8H4"
												/>
											</svg>
										</button>
									</div>

									{/* Add to Cart Button */}
									<button
										onClick={() => handleAddToCart(item)}
										disabled={(quantity === 0 && !isAdded) || !item.available}
										className={`w-full ${
											!item.available
												? "bg-gray-400 cursor-not-allowed"
												: isAdded
												? "bg-green-600"
												: quantity === 0
												? "bg-gray-300 cursor-not-allowed"
												: "bg-green-500 hover:bg-green-600"
										} text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2`}
									>
										{isAdded ? (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
												Added to Cart
											</>
										) : (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
												{quantity === 0
													? "Select Quantity"
													: `Add ${quantity} to Cart`}
											</>
										)}
									</button>

									{/* Total Price Display */}
									{quantity > 0 && (
										<p className="text-center text-sm text-gray-600 mt-2">
											Total: ₹{item.price * quantity}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
			</main>

			<footer className="bg-white border-t mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<span className="text-2xl">🍵</span>
							</div>
							<p className="text-sm text-gray-600">
								© 2024 Food Ordering. All rights reserved.
							</p>
						</div>

						<div>
							<h4 className="font-semibold text-gray-900 mb-4">About Us</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Our Story
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Careers
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-gray-900 mb-4">Support</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										FAQs
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-gray-900 text-sm"
									>
										Cookie Policy
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
