import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistView = () => {
  const { wishlist, setCurrentView, user, setIsLoginModalOpen } = useStore();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8 shadow-xl">
          <Heart className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">My Saved Wishlist</h2>
          <p className="text-xs text-gray-400 mb-6">Please log in to save and access your reading wishlist across devices.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => setCurrentView('home')} className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span>My Wishlist ({wishlist.length} items)</span>
          </h1>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="p-12 text-center bg-[#1a1a1a] rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">Your wishlist is currently empty.</p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg font-semibold"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
