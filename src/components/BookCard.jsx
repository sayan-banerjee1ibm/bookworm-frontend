import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag } from 'lucide-react';

export const BookCard = ({ book }) => {
  const { wishlist, toggleWishlist, addToCart, viewBookDetails } = useStore();

  const isWishlisted = wishlist.some(b => b.id === book.id);

  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] hover:border-gray-600/80 rounded-xl p-3 flex flex-col justify-between group transition duration-200 hover:shadow-xl hover:-translate-y-0.5">
      
      {/* Top Section: Cover & Info */}
      <div>
        {/* Book Cover Image Area */}
        <div 
          onClick={() => viewBookDetails(book.id)}
          className="relative w-full h-52 sm:h-56 bg-[#282828] rounded-lg overflow-hidden cursor-pointer flex items-center justify-center mb-3 shadow-inner"
        >
          {book.coverImageUrl ? (
            <img 
              src={book.coverImageUrl} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            style={{ display: book.coverImageUrl ? 'none' : 'flex' }}
            className="w-full h-full p-4 flex-col justify-center items-center text-center bg-gradient-to-br from-gray-800 to-gray-900"
          >
            <span className="font-bold text-sm text-gray-200 line-clamp-2">{book.title}</span>
            <span className="text-xs text-gray-400 mt-1">{book.author}</span>
          </div>

          {/* Wishlist Heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(book.id);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 hover:text-red-400 transition"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Format badge */}
          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-black/70 backdrop-blur-md rounded text-gray-300">
            {book.format}
          </span>
        </div>

        {/* Title & Author */}
        <div onClick={() => viewBookDetails(book.id)} className="cursor-pointer">
          <h3 className="font-semibold text-sm sm:text-base text-gray-100 line-clamp-1 group-hover:text-blue-400 transition">
            {book.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            by <span className="text-blue-400/90 font-medium hover:underline">{book.author}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Tags / Category */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-blue-400/80 font-medium">
          <span className="bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30">
            {book.category}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">{book.language}</span>
        </div>
      </div>

      {/* Bottom Section: Price & Delivery & Cart */}
      <div className="mt-4 pt-3 border-t border-[#2d2d2d] flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-white tracking-tight">
            ₹{book.price}
          </div>
          <div className="text-[11px] text-gray-400">
            {book.tentativeDeliveryDate || 'Delivery in 3 days'}
          </div>
        </div>

        <button
          onClick={() => addToCart(book.id, 1)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
