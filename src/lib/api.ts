const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const toJsonHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  'Content-Type': 'application/json',
});

const normalizeItem = (item: any) => ({
  id: item.itemId ?? item.id,
  itemId: item.itemId ?? item.id,
  name: item.itemName ?? item.name,
  itemName: item.itemName ?? item.name,
  description: item.itemDescription ?? item.description,
  itemDescription: item.itemDescription ?? item.description,
  price: Number(item.price),
  categoryId: item.categoryId,
  imageUrl: item.imageUrl,
  available: item.isAvailable ?? item.available,
  isAvailable: item.isAvailable ?? item.available,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const normalizeOrderStatus = (status?: string) => {
  switch ((status || '').toUpperCase()) {
    case 'PENDING':
      return 'pending';
    case 'CONFIRMED':
      return 'completed';
    case 'CANCELLED':
      return 'canceled';
    default:
      return (status || '').toLowerCase() || 'pending';
  }
};

const toBackendOrderStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'PENDING';
    case 'completed':
      return 'CONFIRMED';
    case 'canceled':
    case 'cancelled':
      return 'CANCELLED';
    default:
      return status.toUpperCase();
  }
};

const normalizeOrderItem = (orderItem: any, itemsById: Map<string, any>) => {
  const itemId = orderItem.itemId ?? orderItem.item?.itemId ?? orderItem.item?.id;
  const itemRecord = orderItem.item ?? (itemId ? itemsById.get(itemId) : undefined);

  return {
    id: orderItem.orderItemId ?? orderItem.id,
    orderItemId: orderItem.orderItemId ?? orderItem.id,
    orderId: orderItem.orderId,
    itemId,
    quantity: Number(orderItem.quantity),
    unitPrice: Number(orderItem.unitPrice ?? orderItem.price ?? 0),
    subtotal: Number(orderItem.subtotal ?? (Number(orderItem.unitPrice ?? orderItem.price ?? 0) * Number(orderItem.quantity ?? 0))),
    item: itemRecord ? normalizeItem(itemRecord) : undefined,
  };
};

const normalizeOrder = (order: any, itemsById: Map<string, any>, orderItems: any[] = []) => ({
  id: order.orderId ?? order.id,
  orderId: order.orderId ?? order.id,
  userId: order.userId,
  totalAmount: Number(order.totalAmount),
  placedAt: order.placedAt ?? order.createdAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  status: normalizeOrderStatus(order.status),
  items: orderItems.map((orderItem) => normalizeOrderItem(orderItem, itemsById)),
});

const normalizeCartItem = (cartItem: any, userId: string, itemsById: Map<string, any>) => {
  const itemId = cartItem.itemId ?? cartItem.item?.itemId ?? cartItem.item?.id;
  const itemRecord = cartItem.item ?? (itemId ? itemsById.get(itemId) : undefined);

  return {
    id: cartItem.cartItemId ?? cartItem.id,
    cartItemId: cartItem.cartItemId ?? cartItem.id,
    cartId: cartItem.cartId,
    userId,
    itemId,
    quantity: Number(cartItem.quantity),
    item: itemRecord ? normalizeItem(itemRecord) : undefined,
  };
};

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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Invalid token');
    }

    // Add token to headers
    // options.headers = {
    //   ...options.headers,
    //   'Authorization': `Bearer ${token}`,
    // };

    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!token) {
      window.location.href = '/login';
      throw new Error('No token found');
    }

    options.headers = headers;
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
        headers: toJsonHeaders(),
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
        headers: toJsonHeaders(),
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

  // Get all users
  getAll: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Get all users API Error:', error);
      throw error;
    }
  },

  // Get all customers (users with role 'customer')
  getAllCustomers: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/customers`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Get all customers API Error:', error);
      throw error;
    }
  }
};

// Orders API
export const ordersApi = {
  // Create order from cart (Checkout)
  checkout: async (userId: string, paymentMethod: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: toJsonHeaders(),
        body: JSON.stringify({ userId, paymentMethod }),
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
      const response = await fetchWithAuth(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: toJsonHeaders(),
        body: JSON.stringify({ userId, totalAmount }),
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
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP error! status: ${response.status}`);
    }
    return {
      ...json,
      data: {
        ...json.data,
        data: (json.data?.data || []).map((order: any) => ({
          ...order,
          id: order.orderId ?? order.id,
          orderId: order.orderId ?? order.id,
          status: normalizeOrderStatus(order.status),
        })),
      },
    };
  },

  // Get order by ID
  getById: async (id: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}`);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP error! status: ${response.status}`);
    }
    return {
      ...json,
      data: {
        ...json.data,
        id: json.data?.orderId ?? json.data?.id,
        orderId: json.data?.orderId ?? json.data?.id,
        status: normalizeOrderStatus(json.data?.status),
      },
    };
  },

  // Get orders by user ID
  getByUserId: async (userId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/user/${userId}`);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP error! status: ${response.status}`);
    }

    const itemsResponse = await itemsApi.getAll();
    const items = Array.isArray(itemsResponse) ? itemsResponse : itemsResponse.rows || [];
    const itemsById = new Map<string, any>();
    items.forEach((item: any) => {
      const normalized = normalizeItem(item);
      itemsById.set(normalized.id, normalized);
      itemsById.set(normalized.itemId, normalized);
    });

    const hydratedOrders = await Promise.all((json.data || []).map(async (order: any) => {
      const orderItemsResponse = await orderItemsApi.getByOrderId(order.orderId ?? order.id);
      const orderItems = Array.isArray(orderItemsResponse) ? orderItemsResponse : orderItemsResponse.data || [];
      return normalizeOrder(order, itemsById, orderItems);
    }));

    return {
      ...json,
      data: hydratedOrders,
    };
  },

  // Update order status
  updateStatus: async (id: string, status: string) => {
    try {
      console.log(`API: Updating order ${id} to status ${status}`);
      const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: toJsonHeaders(),
        body: JSON.stringify({ status: toBackendOrderStatus(status) }),
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
  // Create Razorpay order for checkout
  createRazorpayOrder: async (orderId: string, amount: number) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: toJsonHeaders(),
      body: JSON.stringify({ orderId, amount }),
    });
    return response.json();
  },

  // Backward-compatible alias for older callers
  process: async (orderId: string, amount: number) => {
    return paymentsApi.createRazorpayOrder(orderId, amount);
  },

  // Get payment by order ID
  getByOrderId: async (orderId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/payments/order/${orderId}`);
    return response.json();
  },

  // Get all payments
  getAll: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/payments`);
    return response.json();
  },
};

export const itemsApi = {
  // Get all items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/items`);
    const json = await response.json();
    const items = (json.data?.data || []).map((item: any) => normalizeItem(item));
    (items as any).rows = items;
    return items;
  },

  // Update item (Admin only)
  update: async (id: string, data: {
    name?: string;
    price?: number;
    available?: boolean;
    imageUrl?: string;
  }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: toJsonHeaders(),
        body: JSON.stringify({
          itemName: data.name,
          price: data.price,
          isAvailable: data.available,
          imageUrl: data.imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update item API Error:', error);
      throw error;
    }
  }
}

export const orderItemsApi = {
  // Create new order item
  create: async (orderId: string, itemId: string, quantity: number) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/order-items`, {
        method: 'POST',
        headers: toJsonHeaders(),
        body: JSON.stringify({ orderId, itemId, quantity }),
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getAll: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/order-items`);
    return response.json();
  },
  getByOrderId: async (orderId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/order-items/order/${orderId}`);
    return response.json();
  },
}

export const itemOrdersApi = orderItemsApi;

export const cartApi = {
  // Get cart by user ID
  getCartByUserId: async (userId: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cart/user/${userId}`);
      if (response.status === 404) {
        return null;
      }
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || `HTTP error! status: ${response.status}`);
      }
      return json.data;
    } catch (error) {
      console.error('Get cart API Error:', error);
      throw error;
    }
  },

  // Create cart for user
  createCart: async (userId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: toJsonHeaders(),
      body: JSON.stringify({ userId }),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || `HTTP error! status: ${response.status}`);
    }
    return json.data;
  },

  // Add item to cart
  addToCart: async (userId: string, itemId: string, quantity: number) => {
    try {
      let cart = await cartApi.getCartByUserId(userId);
      console.log('Current cart for user', userId, ':', cart);
      if (!cart) {
        cart = await cartApi.createCart(userId);
      }

      console.log('Adding item to cart:', { cartId: cart.cartId, itemId, quantity });
      const response = await fetchWithAuth(`${API_BASE_URL}/cart-items`, {
        method: 'POST',
        headers: toJsonHeaders(),
        body: JSON.stringify({ cartId: cart.cartId, itemId, quantity }),
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
      const cart = await cartApi.getCartByUserId(userId);
      if (!cart) {
        return [];
      }

      const [cartItemsResponse, itemsResponse] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/cart-items/cart/${cart.cartId ?? cart.id}`),
        itemsApi.getAll(),
      ]);

      if (!cartItemsResponse.ok) {
        const errorData = await cartItemsResponse.json().catch(() => ({ message: cartItemsResponse.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${cartItemsResponse.status}`);
      }

      const json = await cartItemsResponse.json();
      const cartItems = json.data || [];
      const items = Array.isArray(itemsResponse) ? itemsResponse : itemsResponse.rows || [];
      const itemsById = new Map<string, any>();

      items.forEach((item: any) => {
        const normalized = normalizeItem(item);
        itemsById.set(normalized.id, normalized);
        itemsById.set(normalized.itemId, normalized);
      });

      return cartItems.map((cartItem: any) => normalizeCartItem(cartItem, userId, itemsById));
    } catch (error) {
      console.error('Get cart items API Error:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: string, quantity: number) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/cart-items/${cartItemId}`, {
        method: 'PUT',
        headers: toJsonHeaders(),
        body: JSON.stringify({ quantity }),
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
      const response = await fetchWithAuth(`${API_BASE_URL}/cart-items/${cartItemId}`, {
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
