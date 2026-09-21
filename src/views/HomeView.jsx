import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { Search, Sparkles, TrendingUp, Compass, Filter, RefreshCw, AlertCircle } from 'lucide-react';

export const HomeView = () => {
  const { user, searchFilter, setSearchFilter } = useStore();

  const [categories, setCategories] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Load Categories & Shelves on mount
  useEffect(() => {
    loadInitialCatalog();
  }, [user]);

  // Trigger search when search filter changes
  useEffect(() => {
    const isSearching = searchFilter.q || 
                        searchFilter.category !== 'All' || 
                        searchFilter.language !== 'All' || 
                        searchFilter.format !== 'All' || 
                        searchFilter.priceRange !== 'All' ||
                        searchFilter.sortBy !== 'RELEVANCE';

    if (isSearching) {
      handleSearch();
    } else {
      setSearchResults(null);
    }
  }, [searchFilter]);

  const loadInitialCatalog = async () => {
    setLoading(true);
    setError(false);
    try {
      const [cats, rec, best, news] = await Promise.all([
        api.getCategories(),
        api.getPersonalizedRecommendations(user?.memberId),
        api.getBestsellers(),
        api.getNewLaunches()
      ]);
      setCategories(cats || []);
      setRecommended(rec || []);
      setBestsellers(best || []);
      setNewLaunches(news || []);
    } catch (e) {
      console.error('Error loading shelves', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let minPrice = null;
      let maxPrice = null;
      if (searchFilter.priceRange === 'Under ₹200') {
        maxPrice = 200;
      } else if (searchFilter.priceRange === '₹200 - ₹400') {
        minPrice = 200;
        maxPrice = 400;
      } else if (searchFilter.priceRange === 'Above ₹400') {
        minPrice = 400;
      }

      const results = await api.searchBooks({
        q: searchFilter.q,
        category: searchFilter.category,
        language: searchFilter.language,
        format: searchFilter.format,
        minPrice,
        maxPrice,
        sortBy: searchFilter.sortBy
      });
      setSearchResults(results || []);
    } catch (e) {
      console.error('Search error', e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading your bookstore...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-white font-semibold text-base">Cannot reach the backend</p>
        <p className="text-gray-400 text-sm text-center max-w-sm">
          Make sure the Spring Boot server is running on <span className="text-blue-400 font-mono">http://localhost:8080</span> and then retry.
        </p>
        <button
          onClick={loadInitialCatalog}
          className="mt-2 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Top Controls: Search Bar and Filters Bar matching wireframe screenshot */}
      <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-3 sm:p-4 mb-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <input
              type="text"
              value={searchFilter.q}
              onChange={(e) => setSearchFilter(prev => ({ ...prev, q: e.target.value }))}
              placeholder="Search you want to read here..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#252525] border border-gray-700/80 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>

          {/* Language Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={searchFilter.language}
              onChange={(e) => setSearchFilter(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[#252525] border border-gray-700/80 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Language: All</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Format Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={searchFilter.format}
              onChange={(e) => setSearchFilter(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[#252525] border border-gray-700/80 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Format (All)</option>
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hardcover</option>
              <option value="eBook">eBook</option>
              <option value="Audiobook">Audiobook</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="lg:col-span-2">
            <select
              value={searchFilter.priceRange}
              onChange={(e) => setSearchFilter(prev => ({ ...prev, priceRange: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[#252525] border border-gray-700/80 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Price Range (All)</option>
              <option value="Under ₹200">Under ₹200</option>
              <option value="₹200 - ₹400">₹200 - ₹400</option>
              <option value="Above ₹400">Above ₹400</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={searchFilter.sortBy}
              onChange={(e) => setSearchFilter(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[#252525] border border-gray-700/80 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="RELEVANCE">Sort: Relevance</option>
              <option value="PRICE_LOW_HIGH">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW">Price: High to Low</option>
              <option value="NEWEST">Newest Arrivals</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid: Left Sidebar Categories + Right Books Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Category Sidebar (matching screenshots) */}
        <div className="lg:col-span-3">
          <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-4 sticky top-20 shadow-lg">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Categories</span>
            </h2>

            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
              <button
                onClick={() => setSearchFilter(prev => ({ ...prev, category: 'All' }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                  searchFilter.category === 'All'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-[#252525]'
                }`}
              >
                All Categories
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchFilter(prev => ({ ...prev, category: cat.name }))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                    searchFilter.category === cat.name
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-[#252525]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Books Content Feed */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* SEARCH RESULTS FEED (if search active) */}
          {searchResults !== null ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-blue-400" />
                  <span>Search Results ({searchResults.length})</span>
                </h2>
                <button
                  onClick={() => setSearchFilter({ q: '', category: 'All', language: 'All', format: 'All', priceRange: 'All', sortBy: 'RELEVANCE' })}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Clear Filters
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-12 text-center bg-[#1a1a1a] rounded-2xl border border-gray-800">
                  <p className="text-gray-400 text-sm">No books found matching your current filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchResults.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* 1. RECOMMENDED FOR YOU SHELF */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Recommended for You</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommended.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>

              {/* 2. BESTSELLERS THIS MONTH SHELF */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-red-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Bestsellers this Month</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bestsellers.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>

              {/* 3. NEW LAUNCHES SHELF */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">New Launches</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {newLaunches.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
