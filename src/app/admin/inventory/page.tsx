"use client";
import { useEffect, useState } from "react";
import { itemsApi } from "@/lib/api";

type InventoryItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  imageUrl?: string;
};

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const items = await itemsApi.getAll();
      setInventory(items);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load items");
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const confirmMsg = currentStatus 
      ? "Mark this item as unavailable?" 
      : "Mark this item as available?";
    
    if (confirm(confirmMsg)) {
      try {
        await itemsApi.update(id, { available: !currentStatus });
        // Update local state instead of reloading all items
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        ));
      } catch (err: any) {
        alert(err.message || "Failed to update availability");
      }
    }
  };

  const updatePrice = async (id: string, currentPrice: number, itemName: string) => {
    const newPriceStr = prompt(`Enter new price for ${itemName}:`, currentPrice.toString());
    
    if (newPriceStr === null) return; // User cancelled
    
    const newPrice = parseFloat(newPriceStr);
    
    if (isNaN(newPrice) || newPrice < 0) {
      alert("Please enter a valid price");
      return;
    }
    
    try {
      await itemsApi.update(id, { price: newPrice });
      alert(`Price updated successfully to ₹${newPrice}`);
      // Update local state instead of reloading all items
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, price: newPrice } : item
      ));
    } catch (err: any) {
      alert(err.message || "Failed to update price");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-800">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button
          onClick={loadItems}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
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
              <th className="px-4 py-3 text-gray-900">Image</th>
              <th className="px-4 py-3 text-gray-900">Item</th>
              <th className="px-4 py-3 text-gray-900">Price (₹)</th>
              <th className="px-4 py-3 text-gray-900">Status</th>
              <th className="px-4 py-3 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-700">
                  No items found. Run the seeder to add items.
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-800">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.available 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                        onClick={() => updatePrice(item.id, item.price, item.name)}
                      >
                        Edit Price
                      </button>
                      <button
                        className={`px-4 py-1 text-sm rounded ${
                          item.available
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                        onClick={() => toggleAvailability(item.id, item.available)}
                      >
                        {item.available ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
