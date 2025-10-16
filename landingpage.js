import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LogIn, UserPlus } from 'lucide-react';

export default function BookAnimation() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const pages = [
    { 
      title: 'Welcome to Feelflow', 
      content: 'Track your emotions and understand your patterns over time. Your journey to emotional wellness starts here.',
      icon: '📖'
    },
    { 
      title: 'Daily Reflections', 
      content: 'Take a moment each day to reflect on what you\'re feeling. Small moments of reflection lead to big insights.',
      icon: '✨'
    },
    { 
      title: 'Growth & Insights', 
      content: 'Discover meaningful patterns in your emotional wellness. Understand yourself better with every entry.',
      icon: '📈'
    },
    { 
      title: 'Feel Better Today', 
      content: 'Start your journey towards emotional clarity and balance. You deserve to understand and embrace your feelings.',
      icon: '💚'
    },
  ];

  const nextPage = () => {
    if (!isFlipping && currentPage < pages.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (!isFlipping && currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const totalPages = pages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4" style={{ backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)' }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Feelflow</h1>
          <p className="text-slate-300">Understand Your Emotions, Improve Your Wellbeing</p>
        </div>

        {/* Book Container */}
        <div className="perspective flex gap-8 items-center justify-center mb-12">
          {/* Left Page */}
          <div className="hidden md:flex w-48 h-80 bg-white rounded-lg shadow-2xl overflow-hidden flex-col items-center justify-center p-8 text-center">
            {currentPage > 0 ? (
              <div className={`transition-opacity duration-600 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}>
                <div className="text-4xl mb-4">{pages[currentPage - 1].icon}</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#4A90E2' }}>
                  {pages[currentPage - 1].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pages[currentPage - 1].content}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-slate-400 text-sm font-semibold">Begin Reading</p>
              </div>
            )}
          </div>

          {/* Right Page (Current) */}
          <div className="w-full md:w-48 h-80 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center relative">
            <div className={`transition-all duration-600 ${isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="text-4xl mb-4">{pages[currentPage].icon}</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#4A90E2' }}>
                {pages[currentPage].title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pages[currentPage].content}
              </p>
            </div>
            {/* Page Number */}
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-semibold">
              {currentPage + 1}/{totalPages}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="p-3 rounded-full text-white transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#4A90E2' }}
            onMouseEnter={(e) => !currentPage === 0 && (e.target.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'}
            title="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentPage ? 'w-8' : 'w-2 bg-slate-500'
                }`}
                style={{ backgroundColor: idx === currentPage ? '#4A90E2' : undefined }}
                onClick={() => {
                  if (!isFlipping) {
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentPage(idx);
                      setIsFlipping(false);
                    }, 600);
                  }
                }}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1 || isFlipping}
            className="p-3 rounded-full text-white transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#4A90E2' }}
            onMouseEnter={(e) => currentPage !== pages.length - 1 && (e.target.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'}
            title="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 border-2"
            style={{ borderColor: '#4A90E2', color: '#4A90E2' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4A90E2';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#4A90E2';
            }}
          >
            <LogIn size={20} />
            Log In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200"
            style={{ backgroundColor: '#4A90E2' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'}
          >
            <UserPlus size={20} />
            Sign Up
          </button>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#4A90E2' }}>
                {authMode === 'login' ? 'Log In' : 'Sign Up'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400"
                />
                {authMode === 'signup' && (
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                )}
              </div>

              <button
                className="w-full py-2 rounded-lg text-white font-semibold transition-all duration-200 mb-4"
                style={{ backgroundColor: '#4A90E2' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'}
              >
                {authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2 rounded-lg text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-all duration-200"
              >
                Cancel
              </button>

              <div className="text-center mt-4 text-slate-600 text-sm">
                {authMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="font-semibold"
                      style={{ color: '#4A90E2' }}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="font-semibold"
                      style={{ color: '#4A90E2' }}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}