import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Authentication & Member state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bw_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Unique Cart ID (stored in localStorage for persistence) — must be a valid UUID for the backend
  const [cartId] = useState(() => {
    let saved = localStorage.getItem('bw_cart_id');
    if (!saved || !saved.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      saved = crypto.randomUUID();
      localStorage.setItem('bw_cart_id', saved);
    }
    return saved;
  });

  const [cart, setCart] = useState({ items: [], totalItemsCount: 0, subtotal: 0.0 });
  const [wishlist, setWishlist] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'book-details' | 'cart' | 'checkout' | 'orders' | 'wishlist' | 'writers'
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null); // For order confirmation / payment modal
  const [searchFilter, setSearchFilter] = useState({
    q: '',
    category: 'All',
    language: 'All',
    format: 'All',
    priceRange: 'All',
    sortBy: 'RELEVANCE'
  });

  // Load cart on startup
  useEffect(() => {
    refreshCart();
  }, [cartId]);

  // Load wishlist if logged in
  useEffect(() => {
    if (user?.memberId) {
      refreshWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const refreshCart = async () => {
    try {
      const data = await api.getCart(cartId);
      setCart(data);
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  };

  const refreshWishlist = async () => {
    if (!user?.memberId) return;
    try {
      const data = await api.getWishlist(user.memberId);
      setWishlist(data || []);
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  };

  const loginUser = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data);
    localStorage.setItem('bw_user', JSON.stringify(data));
    setIsLoginModalOpen(false);
    return data;
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('bw_user');
  };

  const addToCart = async (bookId, quantity = 1) => {
    try {
      const updated = await api.addToCart(cartId, bookId, quantity);
      setCart(updated);
    } catch (e) {
      console.error('Add to cart failed', e);
    }
  };

  const updateCartQty = async (itemId, quantity) => {
    try {
      const updated = await api.updateCartItem(cartId, itemId, quantity);
      setCart(updated);
    } catch (e) {
      console.error('Update qty failed', e);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const updated = await api.removeFromCart(cartId, itemId);
      setCart(updated);
    } catch (e) {
      console.error('Remove from cart failed', e);
    }
  };

  const toggleWishlist = async (bookId) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const isBookInWishlist = wishlist.some(b => b.id === bookId);
    if (isBookInWishlist) {
      await api.removeFromWishlist(user.memberId, bookId);
    } else {
      await api.addToWishlist(user.memberId, bookId);
    }
    await refreshWishlist();
  };

  const viewBookDetails = (bookId) => {
    setSelectedBookId(bookId);
    setCurrentView('book-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider value={{
      user,
      cartId,
      cart,
      wishlist,
      isLoginModalOpen,
      setIsLoginModalOpen,
      currentView,
      setCurrentView,
      selectedBookId,
      setSelectedBookId,
      activeOrder,
      setActiveOrder,
      searchFilter,
      setSearchFilter,
      loginUser,
      logoutUser,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartQty,
      removeFromCart,
      toggleWishlist,
      viewBookDetails
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
