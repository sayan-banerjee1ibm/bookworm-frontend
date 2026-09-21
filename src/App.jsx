import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { HomeView } from './views/HomeView';
import { BookDetailView } from './views/BookDetailView';
import { CartCheckoutView } from './views/CartCheckoutView';
import { OrdersView } from './views/OrdersView';
import { WishlistView } from './views/WishlistView';
import { WritersView } from './views/WritersView';

function AppContent() {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'book-details' && <BookDetailView />}
        {currentView === 'cart' && <CartCheckoutView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'writers' && <WritersView />}
      </main>

      <footer className="bg-[#181818] border-t border-[#2d2d2d] py-6 text-center text-xs text-gray-500">
        <p>© 2026 Book Worm E-Store Platform. Built with React & Tailwind CSS.</p>
      </footer>

      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
