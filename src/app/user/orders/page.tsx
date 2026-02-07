"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { useEffect } from "react";

export default function UserOrdersPage() {
  const { user } = useAuth();
  const { orders, loading, cancelOrder, refreshOrders } = useOrder();

  useEffect(() => {
    if (user) {
      refreshOrders();
    }
  }, [user]);

  const canCancel = (order: any) => {
    const created = new Date(order.createdAt).getTime();
    const now = Date.now();
    return order.status === "pending" && now - created <= 5 * 60 * 1000;
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId);
        alert("Order cancelled successfully");
      } catch (error) {
        alert("Failed to cancel order. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <button
          onClick={refreshOrders}
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {orders.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-600">No orders found.</p>
          <a href="/" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
            Start Shopping →
          </a>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-gray-900 text-lg">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Order Items:</p>
              <div className="space-y-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800">
                        <span className="font-medium">{item.name}</span> × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No items available</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/orders/${order.id}`}
                  className="text-sm bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-medium transition"
                >
                  View Details
                </a>
                {canCancel(order) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-sm bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-medium transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {canCancel(order) && (
              <p className="text-xs text-gray-500 mt-3 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                You can cancel this order within 5 minutes of placing it
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
