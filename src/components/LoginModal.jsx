import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User, Eye, EyeOff, BookOpen } from 'lucide-react';

export const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser } = useStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('john.reader@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegisterMode) {
        // Handle quick register
        const regRes = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        if (!regRes.ok) throw new Error('Registration failed. Email may already exist.');
      }
      await loginUser(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1c1c1c] border border-gray-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Form Area */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-500 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wider uppercase">Book Worm</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isRegisterMode ? 'Create an Account' : 'Welcome to Book Worm'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isRegisterMode ? 'Sign up to build your reading wishlist & track orders' : 'Log in to access your orders, gift points & saved reads'}
            </p>

            {error && (
              <div className="mt-3 p-2.5 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Your Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Reader"
                      className="w-full pl-9 pr-3 py-2 bg-[#282828] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Phone Number / e-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 bg-[#282828] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-medium text-gray-300">Password</label>
                  {!isRegisterMode && (
                    <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-blue-400 hover:underline">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-9 pr-9 py-2 bg-[#282828] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg transition"
                >
                  {loading ? 'Processing...' : (isRegisterMode ? 'Sign Up' : 'Sign In')}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <div>
              <span className="text-gray-400">
                {isRegisterMode ? 'Already have an account? ' : 'New to Book Worm? '}
              </span>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
                className="text-blue-400 font-semibold hover:underline"
              >
                {isRegisterMode ? 'Sign In' : 'Sign Up Here'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[11px] transition"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Right Decorative Graphic Area (matching screenshot) */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#1a365d] via-[#1e293b] to-[#0f172a] p-8 items-center justify-center relative overflow-hidden border-l border-gray-800">
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <BookOpen className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Unlock Reader Perks</h3>
            <p className="text-xs text-blue-200/70 mt-2 leading-relaxed">
              Earn gift points on purchases, track deliveries in real time, and enjoy instant 48-hour order cancellation.
            </p>
          </div>

          {/* Abstract circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
};
