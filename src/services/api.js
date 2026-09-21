const API_BASE = '/api/v1';

export const api = {
  // Auth & Member
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  register: async (name, email, password, phone) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  getProfile: async (memberId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/profile`);
    return res.json();
  },

  getAddresses: async (memberId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/addresses`);
    return res.json();
  },

  addAddress: async (memberId, address) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address)
    });
    return res.json();
  },

  // Wishlist
  getWishlist: async (memberId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/wishlist`);
    return res.json();
  },

  addToWishlist: async (memberId, bookId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId })
    });
    return res.ok;
  },

  removeFromWishlist: async (memberId, bookId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/wishlist/${bookId}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  // Writers
  getWriters: async (memberId) => {
    const res = await fetch(`${API_BASE}/members/${memberId}/writers`);
    return res.json();
  },

  // Catalog
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/catalog/categories`);
    return res.json();
  },

  getBookById: async (bookId) => {
    const res = await fetch(`${API_BASE}/catalog/books/${bookId}`);
    return res.json();
  },

  getBestsellers: async () => {
    const res = await fetch(`${API_BASE}/catalog/shelves/bestsellers`);
    return res.json();
  },

  getNewLaunches: async () => {
    const res = await fetch(`${API_BASE}/catalog/shelves/new-launches`);
    return res.json();
  },

  // Recommendations
  getPersonalizedRecommendations: async (memberId) => {
    const url = memberId ? `${API_BASE}/recommendations/personalized?memberId=${memberId}` : `${API_BASE}/recommendations/personalized`;
    const res = await fetch(url);
    return res.json();
  },

  getRelatedBooks: async (bookId) => {
    const res = await fetch(`${API_BASE}/recommendations/related/${bookId}`);
    return res.json();
  },

  // Search & Filter
  searchBooks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.language && params.language !== 'All') query.append('language', params.language);
    if (params.format && params.format !== 'All') query.append('format', params.format);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/search?${query.toString()}`);
    return res.json();
  },

  // Cart
  getCart: async (cartId) => {
    const res = await fetch(`${API_BASE}/cart/${cartId}`);
    return res.json();
  },

  addToCart: async (cartId, bookId, quantity = 1) => {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, quantity })
    });
    return res.json();
  },

  updateCartItem: async (cartId, itemId, quantity) => {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items/${itemId}?quantity=${quantity}`, {
      method: 'PUT'
    });
    return res.json();
  },

  removeFromCart: async (cartId, itemId) => {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Orders
  createOrder: async (orderReq) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderReq)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order');
    }
    return res.json();
  },

  getMemberOrders: async (memberId) => {
    const res = await fetch(`${API_BASE}/orders/member/${memberId}`);
    return res.json();
  },

  cancelOrder: async (orderId) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to cancel order');
    }
    return res.json();
  },

  buyAgain: async (orderId, targetCartId) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/buy-again`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCartId })
    });
    return res.json();
  },

  // Payment
  processPayment: async (paymentReq) => {
    const res = await fetch(`${API_BASE}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentReq)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Payment failed');
    }
    return res.json();
  },

  // Reviews
  getReviewsForBook: async (bookId) => {
    const res = await fetch(`${API_BASE}/reviews/book/${bookId}`);
    return res.json();
  },

  addReview: async (reviewReq) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewReq)
    });
    return res.json();
  },

  // Coupons
  applyCoupon: async (code, orderAmount) => {
    const res = await fetch(`${API_BASE}/coupons/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderAmount })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid coupon');
    }
    return res.json();
  }
};
