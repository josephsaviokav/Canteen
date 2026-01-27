"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

type OrderStatus = "pending" | "completed" | "canceled";

type OrderItem = {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  subTotal: number;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export default function UserOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem("orders");
    if (!stored) return;

    const allOrders: Order[] = JSON.parse(stored);
    setOrders(allOrders.filter((o) => o.userId === user.id));
  }, [user]);

  const canCancel = (order: Order) => {
    const created = new Date(order.createdAt).getTime();
    const now = Date.now();
    return order.status === "pending" && now - created <= 5 * 60 * 1000;
  };

  const cancelOrder = (orderId: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "canceled" as const,
            updatedAt: new Date().toISOString(),
          }
        : o
    );

    setOrders(updated);

    const all = JSON.parse(localStorage.getItem("orders") || "[]");
    const merged = all.map((o: Order) =>
      o.id === orderId ? updated.find((u) => u.id === o.id) : o
    );

    localStorage.setItem("orders", JSON.stringify(merged));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    Item {item.itemId} × {item.quantity}
                  </span>
                  <span>₹{item.subTotal}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold">Total: ₹{order.totalAmount}</p>

              {canCancel(order) && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Cancel & Refund
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
