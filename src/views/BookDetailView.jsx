import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Globe, 
  BookOpen, 
  User, 
  Send 
} from 'lucide-react';

export const BookDetailView = () => {
  const { 
    selectedBookId, 
    setCurrentView, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    user, 
    setIsLoginModalOpen 
  } = useStore();

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBookId) {
      loadBookDetails(selectedBookId);
    }
  }, [selectedBookId]);

  const loadBookDetails = async (id) => {
    setLoading(true);
    try {
      const [bookData, relatedData, reviewsData] = await Promise.all([
        api.getBookById(id),
        api.getRelatedBooks(id),
        api.getReviewsForBook(id)
      ]);
      setBook(bookData);
      setRelated(relatedData || []);
      setReviews(reviewsData || []);
    } catch (e) {
      console.error('Failed to load book', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const savedReview = await api.addReview({
        bookId: book.id,
        memberId: user.memberId,
        authorName: user.name || 'Verified Reader',
        rating: newRating,
        comment: newComment
      });
      setReviews(prev => [savedReview, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error('Failed to submit review', e);
    }
  };

  if (loading || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">
        Loading book details...
      </div>
    );
  }

  const isWishlisted = wishlist.some(b => b.id === book.id);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-white flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-gray-300">{book.category}</span>
        <span>/</span>
        <span className="text-blue-400 font-medium truncate">{book.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Book Artwork Showcase + Author Details + Reviews */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Book Card Banner */}
          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 shadow-xl">
            
            {/* Book Artwork Image */}
            <div className="w-full md:w-5/12 flex-shrink-0">
              <div className="relative w-full h-80 bg-[#252525] rounded-xl overflow-hidden shadow-2xl border border-gray-700/60">
                <img 
                  src={book.coverImageUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-semibold bg-black/80 backdrop-blur-md rounded text-white">
                  {book.format}
                </span>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {book.title}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  by <span className="text-blue-400 font-medium">{book.author}</span>
                </p>

                {/* Rating & Sales */}
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1.5 text-xs text-gray-300 font-bold">{book.rating || 4.8}</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-emerald-400 font-medium">145 copies sold</span>
                </div>

                <p className="text-xs text-gray-300 mt-4 leading-relaxed line-clamp-4">
                  {book.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-gray-800 rounded text-gray-300">Language: {book.language}</span>
                  <span className="px-2.5 py-1 bg-gray-800 rounded text-gray-300">Format: {book.format}</span>
                  <span className="px-2.5 py-1 bg-gray-800 rounded text-gray-300">Category: {book.category}</span>
                </div>
              </div>

              {/* Price, Delivery & Actions */}
              <div className="mt-6 pt-5 border-t border-[#2d2d2d]">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold text-white">₹{book.price}</span>
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>{book.tentativeDeliveryDate || 'Delivery by Mon, 21 Jul'}</span>
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => addToCart(book.id, 1)}
                    className="flex-1 min-w-[140px] py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center space-x-2 transition ${
                      isWishlisted 
                        ? 'bg-red-950/40 border-red-800 text-red-400' 
                        : 'bg-[#252525] border-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* About the Writer Section */}
          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">About the writer</h2>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg flex-shrink-0">
                {book.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{book.author}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {book.author} is an acclaimed writer and subject matter specialist with multiple international publications, dedicated to empowering readers with actionable life insights and storytelling.
                </p>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Reviews & Community Ratings</h2>
            
            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-[#242424] rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-300">Leave Your Review</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`w-4 h-4 cursor-pointer transition ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <textarea
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this book..."
                rows={3}
                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to share your reading experience!</p>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="p-3 bg-[#242424] rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{r.authorName}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Related Reads Sidebar (matching screenshot) */}
        <div className="lg:col-span-4">
          <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-5 shadow-xl sticky top-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Related Reads</span>
            </h2>

            <div className="space-y-4">
              {related.map(relBook => (
                <div 
                  key={relBook.id}
                  onClick={() => loadBookDetails(relBook.id)}
                  className="p-3 bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] rounded-xl flex items-center space-x-3 cursor-pointer group transition"
                >
                  <div className="w-14 h-18 bg-gray-800 rounded overflow-hidden flex-shrink-0 shadow">
                    <img src={relBook.coverImageUrl} alt={relBook.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-gray-200 truncate group-hover:text-blue-400 transition">
                      {relBook.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">by {relBook.author}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">₹{relBook.price}</span>
                      <span className="text-[10px] text-gray-400">{relBook.format}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
