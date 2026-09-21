import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { 
  Package, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag,
  ArrowLeft,
  Truck
} from 'lucide-react';

export const OrdersView = () => {
  const { user, cartId, setCurrentView, setIsLoginModalOpen, refreshCart } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user?.memberId) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMemberOrders(user.memberId);
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? It will restore your payment and gift points.')) {
      return;
    }
    setActionLoading(orderId);
    try {
      await api.cancelOrder(orderId);
      await loadOrders();
    } catch (e) {
      alert(e.message || 'Unable to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyAgain = async (orderId) => {
    setActionLoading(orderId);
    try {
      await api.buyAgain(orderId, cartId);
      await refreshCart();
      setCurrentView('cart');
    } catch (e) {
      alert(e.message || 'Unable to re-order');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8 shadow-xl">
          <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">View Your Order History</h2>
          <p className="text-xs text-gray-400 mb-6">Please sign in to track active shipments, trigger 48-hour cancellations, or Buy In Again.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => setCurrentView('home')} className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-400" />
            <span>My Orders & Repurchase</span>
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-xs">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-[#1a1a1a] rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">You haven't placed any orders yet.</p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg font-semibold"
          >
            Start Browsing Books
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-xl">
              
              {/* Order Header Bar */}
              <div className="p-4 bg-[#222222] border-b border-[#2d2d2d] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-gray-400">Order Number: </span>
                    <span className="font-bold text-white">{order.orderNumber}</span>
                  </div>
                  <div className="text-gray-400">
                    Placed on: <span className="text-gray-200">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      order.status === 'CANCELLED' 
                        ? 'bg-red-950/60 text-red-400 border border-red-900' 
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="font-bold text-sm text-white">
                  Total: ₹{order.totalAmount}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y divide-[#2d2d2d]">
                {order.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0 shadow">
                        <img src={item.book.coverImageUrl} alt={item.book.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-white">{item.book.title}</h4>
                        <p className="text-[11px] text-gray-400">by {item.book.author} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-white">
                      ₹{item.itemTotal}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions: 48h Cancel & Buy It Again */}
              <div className="p-4 bg-[#1f1f1f] border-t border-[#2d2d2d] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Standard Express Delivery • Estimated Mon, 21 Jul</span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Cancel Button (highlighted in wireframe screen 1 & 12) */}
                  {order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={actionLoading === order.id}
                      className="px-3.5 py-1.5 bg-gray-800 hover:bg-red-950/60 hover:text-red-400 border border-gray-700 hover:border-red-800 text-gray-300 rounded-lg text-xs font-medium transition"
                      title="Available within 48 hours of order placement"
                    >
                      <span className="flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order (48h Window)</span>
                      </span>
                    </button>
                  )}

                  {/* Buy It Again Button (highlighted in wireframe screen 2) */}
                  <button
                    onClick={() => handleBuyAgain(order.id)}
                    disabled={actionLoading === order.id}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center space-x-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Buy In Again</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
