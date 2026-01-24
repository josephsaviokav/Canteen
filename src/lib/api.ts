import { get } from "http";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper function to handle API calls with token validation
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Check if token is expired before making the request
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      
      if (Date.now() >= exp) {
        // Token expired, clear storage and redirect
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Token expired');
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
    
    // Add token to headers
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  const response = await fetch(url, options);
  
  // Handle 401 Unauthorized (expired or invalid token)
  if (response.status === 401) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized - please login again');
  }
  
  return response;
};

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
  // Create order from cart (Checkout)
  checkout: async (userId: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Checkout API Error:', error);
      throw error;
    }
  },

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
    const response = await fetchWithAuth(`${API_BASE_URL}/orders`);
    return response.json();
  },

  // Get order by ID
  getById: async (id: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}`);
    return response.json();
  },

  // Get orders by user ID
  getByUserId: async (userId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/user/${userId}`);
    return response.json();
  },

  // Update order status
  updateStatus: async (id: string, status: string) => {
    try {
      console.log(`API: Updating order ${id} to status ${status}`);
      const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}/status`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}`, {
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

export const itemsApi = {
  // Get all items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/items`);
    const json = await response.json();
    return json.data; // Extract the data array from the response
  }
}

export const itemOrdersApi = {
  // Create new order
  create: async (itemId: string, orderId: string, quantity: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/item-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, orderId, quantity }),
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/item-orders`);
    return response.json();
  }
}

export const cartApi = {
  // Add item to cart
  addToCart: async (userId: string, itemId: string, quantity: number) => {  
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } 
      return response.json();
    } catch (error) {
      console.error('Add to cart API Error:', error);
      throw error;
    }
  },

  // Get cart items by user ID
  getCartItems: async (userId: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cart/${userId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Get cart items API Error:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: string, quantity: number) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Update cart item API Error:', error);
      throw error;
    }
  },

  // Delete cart item
  deleteCartItem: async (cartItemId: string) => {
    try { 
      const response = await fetchWithAuth(`${API_BASE_URL}/cart/delete/${cartItemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return;
    } catch (error) {
      console.error('Delete cart item API Error:', error);
      throw error;
    }
  },
};
