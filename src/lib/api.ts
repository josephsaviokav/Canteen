const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Users API
export const usersApi = {
  // Sign up
  signUp: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log('Sign up API Response:', await response.clone().json());
      
      return response.json();
    } catch (error) {
      console.error('Sign up API Error:', error);
      throw error;
    }
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Sign in API Error:', error);
      throw error;
    }
  },
};

// Orders API
export const ordersApi = {
  // Create new order
  create: async (userId: string, totalAmount: number, items: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, totalAmount, items }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all orders
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json();
  },

  // Get order by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    return response.json();
  },

  // Get orders by user ID
  getByUserId: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return response.json();
  },

  // Update order status
  updateStatus: async (id: string, status: string) => {
    try {
      console.log(`API: Updating order ${id} to status ${status}`);
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API updateStatus error:', error);
      throw error;
    }
  },

  // Delete order
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Payments API
export const paymentsApi = {
  // Process payment
  process: async (orderId: string, amount: number, cardDetails: any) => {
    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        amount,
        ...cardDetails,
      }),
    });
    return response.json();
  },

  // Get payment by order ID
  getByOrderId: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`);
    return response.json();
  },

  // Get all payments
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/payments`);
    return response.json();
  },
};
