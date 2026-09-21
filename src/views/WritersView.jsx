import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { PenTool, ArrowLeft, BookOpen, Check } from 'lucide-react';

export const WritersView = () => {
  const { user, setCurrentView, setIsLoginModalOpen, setSearchFilter } = useStore();
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.memberId) {
      api.getWriters(user.memberId).then(data => {
        setWriters(data || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8 shadow-xl">
          <PenTool className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">My Favorite Writers</h2>
          <p className="text-xs text-gray-400 mb-6">Please log in to manage your subscribed authors and track their latest launches.</p>
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
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => setCurrentView('home')} className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <PenTool className="w-6 h-6 text-blue-400" />
            <span>Subscribed Writers</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {writers.map(writer => (
          <div key={writer.id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-5 flex items-start space-x-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xl flex-shrink-0">
              {writer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{writer.name}</h3>
                <span className="px-2 py-0.5 text-[10px] bg-blue-950 text-blue-400 rounded-full border border-blue-900 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Following</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{writer.bio}</p>

              <button
                onClick={() => {
                  setSearchFilter(prev => ({ ...prev, q: writer.name }));
                  setCurrentView('home');
                }}
                className="mt-3 text-xs text-blue-400 font-medium hover:underline flex items-center space-x-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Books by {writer.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
