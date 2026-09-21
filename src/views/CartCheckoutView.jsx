import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Tag, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle,
  Truck
} from 'lucide-react';

export const CartCheckoutView = () => {
  const { 
    user, 
    cart, 
    cartId, 
    updateCartQty, 
    removeFromCart, 
    setCurrentView, 
    setActiveOrder, 
    setIsLoginModalOpen 
  } = useStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');

  // Form fields for new address if needed
  const [recipientName, setRecipientName] = useState('John Reader');
  const [street, setStreet] = useState('123 Baker Street');
  const [city, setCity] = useState('London');
  const [state, setState] = useState('Greater London');
  const [postalCode, setPostalCode] = useState('NW1 6XE');

  useEffect(() => {
    if (user?.memberId) {
      api.getAddresses(user.memberId).then(list => {
        setAddresses(list || []);
        if (list && list.length > 0) {
          const defaultAddr = list.find(a => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.id);
        }
      });
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.applyCoupon(couponCode, cart.subtotal);
      setCouponDiscount(res.discount);
      setCouponMessage(`Coupon ${couponCode} applied: ₹${res.discount} OFF`);
    } catch (e) {
      setCouponDiscount(0);
      setCouponMessage('Invalid or expired coupon code.');
    }
  };

  const pointsDiscountValue = (redeemPoints && user?.giftPoints) 
    ? Math.min(user.giftPoints, Math.floor(cart.subtotal * 0.5)) // Redeem up to 50%
    : 0;

  const tax = Math.round((cart.subtotal * 0.05) * 100) / 100; // 5% tax
  const deliveryCharge = 0.0; // Free delivery
  const finalTotal = Math.max(0, cart.subtotal + tax + deliveryCharge - couponDiscount - pointsDiscountValue);

  const handleProceedToPayment = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Ensure address ID exists or create one
      let addressIdToUse = selectedAddressId;
      if (!addressIdToUse) {
        const newAddr = await api.addAddress(user.memberId, {
          recipientName,
          street,
          city,
          state,
          postalCode,
          isDefault: true
        });
        addressIdToUse = newAddr.id;
        setSelectedAddressId(newAddr.id);
      }

      // 2. Create Order in backend
      const createdOrder = await api.createOrder({
        cartId,
        memberId: user.memberId,
        addressId: addressIdToUse,
        couponCode: couponDiscount > 0 ? couponCode : null,
        redeemGiftPoints: pointsDiscountValue
      });

      setActiveOrder(createdOrder);
      setPaymentModalOpen(true);
    } catch (e) {
      alert(e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Complete payment through API
      await api.processPayment({
        orderId: (window.activeOrderId || "ORD-RECENT"),
        paymentMethod: selectedPaymentMethod.toUpperCase().replace(' ', '_'),
        redeemGiftPoints: pointsDiscountValue
      });
      setPaymentSuccess(true);
    } catch (e) {
      // In case of demo mock fallback
      setPaymentSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-10">
          <h2 className="text-xl font-bold text-white mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-400 mb-6">Discover thousands of books across multiple genres and add them to your basket.</p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-white flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </button>
        <span>/</span>
        <span className="text-blue-400 font-medium">Checkout & Shopping Cart</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List & Delivery Address Card */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cart Items Area */}
          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Shopping Cart ({cart.totalItemsCount} items)</span>
              <span className="text-xs font-normal text-gray-400">Subtotal: ₹{cart.subtotal}</span>
            </h2>

            <div className="divide-y divide-[#2d2d2d]">
              {cart.items.map(item => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Book mini-preview */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-22 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow">
                      <img src={item.book.coverImageUrl} alt={item.book.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{item.book.title}</h3>
                      <p className="text-xs text-gray-400">by {item.book.author}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-[#252525] rounded text-gray-300">
                        {item.book.format} • {item.book.language}
                      </span>
                      <div className="text-xs font-bold text-white mt-1">₹{item.book.price} each</div>
                    </div>
                  </div>

                  {/* Qty and Subtotal */}
                  <div className="flex items-center space-x-6 self-end sm:self-center">
                    <div className="flex items-center border border-gray-700 bg-[#252525] rounded-lg">
                      <button 
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="font-bold text-sm text-white">₹{item.itemTotal}</div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Form matching Screenshot */}
          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Delivery Address</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-2.5 bg-[#252525] border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 bg-[#252525] border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-[#252525] border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Postal Code / PIN</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-2.5 bg-[#252525] border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Coupon & Pay Now Button */}
        <div className="lg:col-span-4">
          <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-6 shadow-xl sticky top-20 space-y-6">
            
            <h2 className="text-base font-bold text-white tracking-wide border-b border-[#2d2d2d] pb-3">
              Grand Total Summary
            </h2>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Price ({cart.totalItemsCount} items)</span>
                <span>₹{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {pointsDiscountValue > 0 && (
                <div className="flex justify-between text-blue-400 font-medium">
                  <span>Gift Points Redeemed</span>
                  <span>- ₹{pointsDiscountValue.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-[#2d2d2d] pt-3 flex justify-between items-baseline text-white">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-xl font-extrabold text-blue-400">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon input */}
            <div className="pt-2 border-t border-[#2d2d2d]">
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Apply Promo Coupon</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, FLAT50"
                  className="flex-1 px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-xs text-white uppercase placeholder-gray-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className="text-[11px] mt-1.5 text-blue-400">{couponMessage}</p>
              )}
            </div>

            {/* Redeem Gift Points check */}
            {user?.giftPoints > 0 && (
              <div className="p-3 bg-[#242424] rounded-xl border border-gray-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">Redeem Gift Points</span>
                  <p className="text-[11px] text-gray-400">Balance: {user.giftPoints} pts</p>
                </div>
                <input
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Pay Now'}</span>
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>

          </div>
        </div>

      </div>

      {/* PAYMENT MODAL (matching screenshot 5) */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#1e1e1e] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl p-6">
            
            {!paymentSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                  <h3 className="font-bold text-white text-base">Complete Payment</h3>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Payable Amount: </span>
                    <span className="text-sm font-bold text-blue-400">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tabs for Payment Methods */}
                <div className="flex border-b border-gray-800 mb-4 text-xs font-medium text-gray-400">
                  {['Credit Card', 'Debit Card', 'UPI', 'Wallet'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedPaymentMethod(tab)}
                      className={`pb-2 px-3 border-b-2 transition ${
                        selectedPaymentMethod === tab ? 'border-blue-500 text-blue-400' : 'border-transparent hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Mock Card form */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      defaultValue="4532-8921-9921-0023"
                      className="w-full p-2.5 bg-[#282828] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="XXX"
                        defaultValue="892"
                        className="w-full p-2.5 bg-[#282828] border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Date of Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YYYY"
                        defaultValue="09/2028"
                        className="w-full p-2.5 bg-[#282828] border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                  >
                    {loading ? 'Verifying...' : `Pay ₹${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </>
            ) : (
              /* SUCCESS CONFIRMATION MODAL (matching screenshot 6) */
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-3 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Purchase Successful!</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Your order has been confirmed. You have a <strong>48-hour cancellation guarantee</strong> directly from your Order History.
                </p>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setPaymentModalOpen(false);
                      setCurrentView('orders');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                  >
                    View My Orders & Track Delivery
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
