import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  Heart, 
  Clock, 
  PenTool, 
  LogOut, 
  LogIn, 
  Menu, 
  X 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    user, 
    cart, 
    setIsLoginModalOpen, 
    logoutUser, 
    currentView, 
    setCurrentView 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="bg-[#181818] border-b border-[#2d2d2d] sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-6">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center group-hover:bg-blue-600/30 transition">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition">
              Book Worm
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-gray-700/60">
            <button
              onClick={() => setCurrentView('orders')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                currentView === 'orders' 
                  ? 'bg-[#282828] text-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-[#222]'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                currentView === 'wishlist' 
                  ? 'bg-[#282828] text-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-[#222]'
              }`}
            >
              My Wishlist
            </button>
            <button
              onClick={() => setCurrentView('writers')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                currentView === 'writers' 
                  ? 'bg-[#282828] text-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-[#222]'
              }`}
            >
              My Writers
            </button>
          </div>
        </div>

        {/* Right: Actions (Cart & Auth) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Cart Icon with badge */}
          <button
            onClick={() => setCurrentView('cart')}
            className="relative p-2 rounded-full hover:bg-[#262626] text-gray-300 hover:text-white transition"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart?.totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                {cart.totalItemsCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-md hover:bg-[#262626] border border-gray-700/60 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-semibold flex items-center justify-center text-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="text-gray-200 font-medium truncate max-w-[100px]">{user.name}</div>
                  <div className="text-blue-400 text-[10px]">{user.giftPoints || 0} pts</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] border border-gray-700/80 rounded-lg shadow-2xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-800 text-xs">
                    <p className="text-gray-400">Signed in as</p>
                    <p className="font-semibold text-white truncate">{user.email}</p>
                    <p className="text-blue-400 mt-1 font-medium">{user.giftPoints || 0} Gift Points</p>
                  </div>
                  <button
                    onClick={() => { setCurrentView('orders'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#2a2a2a] flex items-center space-x-2"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Order History</span>
                  </button>
                  <button
                    onClick={() => { setCurrentView('wishlist'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#2a2a2a] flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span>Wishlist</span>
                  </button>
                  <button
                    onClick={() => { setCurrentView('writers'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#2a2a2a] flex items-center space-x-2"
                  >
                    <PenTool className="w-4 h-4 text-gray-400" />
                    <span>My Writers</span>
                  </button>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#2a2a2a] flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-md transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-gray-800 mt-3 space-y-1">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#222] rounded"
          >
            Home & Catalog
          </button>
          <button
            onClick={() => { setCurrentView('orders'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#222] rounded"
          >
            My Orders
          </button>
          <button
            onClick={() => { setCurrentView('wishlist'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#222] rounded"
          >
            My Wishlist
          </button>
          <button
            onClick={() => { setCurrentView('writers'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#222] rounded"
          >
            My Writers
          </button>
        </div>
      )}
    </nav>
  );
};
