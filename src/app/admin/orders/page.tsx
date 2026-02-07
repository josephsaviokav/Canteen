"use client";
import { useEffect, useState } from "react";
import { ordersApi, usersApi } from "@/lib/api";

type OrderStatus = "pending" | "completed" | "canceled" | "refunded";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
};

type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState<OrderStatus>("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading orders and users...');
      const [ordersResponse, usersResponse] = await Promise.all([
        ordersApi.getAll(),
        usersApi.getAllCustomers()
      ]);
      console.log('Orders response:', ordersResponse);
      console.log('Users response:', usersResponse);
      
      const ordersData = ordersResponse.data || [];
      const usersData = usersResponse.data || [];
      
      console.log('Orders count:', ordersData.length);
      console.log('Users count:', usersData.length);
      
      setOrders(ordersData);
      setUsers(usersData);
      setError("");
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(id, status);
      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ));
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    }
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditAmount(order.totalAmount.toString());
    setEditStatus(order.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const amount = parseFloat(editAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      // Update status
      await ordersApi.updateStatus(selectedOrder.id, editStatus);
      
      // Update amount (you'll need to add this API endpoint)
      // await ordersApi.updateAmount(selectedOrder.id, amount);

      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, status: editStatus, totalAmount: amount, updatedAt: new Date().toISOString() } 
          : o
      ));

      closeModal();
      alert("Order updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerName = (order: Order) => {
    const user = users.find(u => u.id === order.userId);
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return `User ID: ${order.userId.slice(0, 8)}`;
  };

  const getCustomerEmail = (order: Order) => {
    const user = users.find(u => u.id === order.userId);
    return user?.email || "N/A";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-800">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Total Orders: <span className="font-semibold">{orders.length}</span>
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-gray-900">Order ID</th>
              <th className="px-4 py-3 text-gray-900">Customer</th>
              <th className="px-4 py-3 text-gray-900">Total (₹)</th>
              <th className="px-4 py-3 text-gray-900">Status</th>
              <th className="px-4 py-3 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-700">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div>{getCustomerName(order)}</div>
                    <div className="text-sm text-gray-600">{getCustomerEmail(order)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => viewOrder(order)}
                    >
                      View
                    </button>

                    {order.status === "pending" && (
                      <>
                        <button
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                        >
                          Complete
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => updateOrderStatus(order.id, "canceled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "completed" && (
                      <button
                        className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                        onClick={() => updateOrderStatus(order.id, "refunded")}
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for editing order */}
      {isModalOpen && selectedOrder && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 text-3xl font-light leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              {/* Order ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={selectedOrder.id}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Customer
                </label>
                <input
                  type="text"
                  value={getCustomerName(selectedOrder)}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Order Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Order Date
                </label>
                <input
                  type="text"
                  value={new Date(selectedOrder.createdAt).toLocaleString()}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleUpdateOrder}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
