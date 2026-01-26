// API Service Layer - Centralized API calls to backend
const API_BASE = 'http://localhost:3000/api';

// Helper function for authenticated requests
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Helper function for requests without auth
async function fetchWithoutAuth(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// ============ AUTH API ============
export const authAPI = {
  login: (email, password) =>
    fetchWithoutAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    fetchWithoutAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  syncUser: (userData) =>
    fetchWithoutAuth('/auth/sync-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: () => fetchWithAuth('/auth/profile'),

  isLoggedIn: () => !!localStorage.getItem('token'),
};

// ============ RESTAURANT API ============
// Public endpoints - no authentication required for browsing
export const restaurantAPI = {
  getAll: () => fetchWithoutAuth('/restaurants'),

  getById: (id) => fetchWithoutAuth(`/restaurants/${id}`),

  getCategories: (restaurantId) =>
    fetchWithoutAuth(`/restaurants/${restaurantId}/categories`),

  getItems: (restaurantId) =>
    fetchWithoutAuth(`/restaurants/${restaurantId}/items`),

  getFloorPlan: (restaurantId) =>
    fetchWithoutAuth(`/restaurants/${restaurantId}/floor-plan`),
};

// ============ MENU API ============
export const menuAPI = {
  getCategories: (restaurantId) =>
    fetchWithoutAuth(`/restaurants/${restaurantId}/categories`),

  getItems: (restaurantId) =>
    fetchWithoutAuth(`/restaurants/${restaurantId}/items`),
};

// ============ RESERVATION API ============
export const reservationAPI = {
  create: (reservationData) =>
    fetchWithAuth('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    }),

  update: (id, data) =>
    fetchWithAuth(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getById: (id) => fetchWithAuth(`/reservations/${id}`),

  getUserReservations: () => fetchWithAuth('/reservations'),
};

// ============ CART API ============
export const cartAPI = {
  getCart: () => fetchWithAuth('/cart'),

  addItem: (itemData) =>
    fetchWithAuth('/cart/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  removeItem: (itemId) =>
    fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  updateItemQuantity: (itemId, quantity) =>
    fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  clearCart: (cartId) =>
    fetchWithAuth(`/cart/${cartId}`, {
      method: 'DELETE',
    }),
};

// ============ ORDER API ============
export const orderAPI = {
  create: (orderData) =>
    fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getById: (id) => fetchWithAuth(`/orders/${id}`),

  getUserOrders: () => fetchWithAuth('/orders'),

  getRestaurantOrders: (restaurantId) =>
    fetchWithAuth(`/restaurants/${restaurantId}/orders`),

  updateStatus: (orderId, status) =>
    fetchWithAuth(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ============ STAFF API ============
export const staffAPI = {
  login: (email, password) =>
    fetchWithoutAuth('/staff/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getOrders: (staffId) =>
    fetchWithAuth(`/staff/${staffId}/orders`),

  getReservations: (staffId) =>
    fetchWithAuth(`/staff/${staffId}/reservations`),

  confirmOrder: (orderId) =>
    fetchWithAuth(`/staff/orders/${orderId}/confirm`, {
      method: 'PUT',
    }),

  completeOrder: (orderId) =>
    fetchWithAuth(`/staff/orders/${orderId}/complete`, {
      method: 'PUT',
    }),

  confirmReservation: (reservationId) =>
    fetchWithAuth(`/staff/reservations/${reservationId}/confirm`, {
      method: 'PUT',
    }),
};

// ============ ADMIN API ============
export const adminAPI = {
  login: (email, password) =>
    fetchWithoutAuth('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getStats: () => fetchWithAuth('/admin/stats'),

  getAllOrders: () => fetchWithAuth('/admin/orders'),

  getAllReservations: () => fetchWithAuth('/admin/reservations'),

  getAllRestaurants: () => fetchWithAuth('/admin/restaurants'),

  getAllStaff: () => fetchWithAuth('/admin/staff'),
};

// ============ PAYMENT API ============
export const paymentAPI = {
  create: (paymentData) =>
    fetchWithAuth('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getUserPayments: () => fetchWithAuth('/payments'),
};
