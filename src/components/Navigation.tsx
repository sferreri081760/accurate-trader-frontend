'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { buildApiUrl } from '@/config/api';

const Navigation = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);
  const [isPerformanceDropdownOpen, setIsPerformanceDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(buildApiUrl('/api/user'), {
          credentials: 'include',
        });
        
        if (res.ok) {
          const userData = await res.json();
          setIsLoggedIn(true);
          setIsAdmin(userData.role === 'admin');
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch {
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex sm:items-center sm:space-x-8">
        <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Home
        </Link>
        <Link href="/strategies" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Strategies
        </Link>
        <Link href="/market-conditions" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Market Conditions
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          About
        </Link>
        <Link href="/support" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Support
        </Link>

        {/* Performance Dropdown - Available to everyone */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPerformanceDropdownOpen(true)}
          onMouseLeave={() => setIsPerformanceDropdownOpen(false)}
        >
          <button
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            Performance
            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isPerformanceDropdownOpen && (
            <div className="absolute right-0 top-full w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <Link href="/performance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium border-b border-gray-200">
                  📊 All Performance
                </Link>
                <Link href="/performance/candlestick" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Candlestick
                </Link>
                <Link href="/performance/cup-with-handle-double-bottom" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cup with Handle + Double Bottom
                </Link>
                <Link href="/performance/trend" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Trend
                </Link>
                <Link href="/performance/support-resistance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Support-Resistance
                </Link>
                <Link href="/performance/midpointtwo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  MidpointTwo
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <Link href="/performance/transparency" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium">
                  🎥 Performance Transparency
                </Link>
              </div>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <>
            {/* Admin Dropdown - Only visible to admin users */}
            {isAdmin && (
              <div
                className="relative group"
                onMouseEnter={() => setIsAdminDropdownOpen(true)}
                onMouseLeave={() => setIsAdminDropdownOpen(false)}
              >
                <button
                  className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center border border-red-200 hover:border-red-300"
                >
                  ⚙️ Admin
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isAdminDropdownOpen && (
                  <div className="absolute right-0 top-full w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link href="/admin/charts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 font-medium">
                        📊 Admin Charts
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Members Dropdown (hover-stable) */}
            <div
              className="relative group"
              onMouseEnter={() => setIsMembersDropdownOpen(true)}
              onMouseLeave={() => setIsMembersDropdownOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Members
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isMembersDropdownOpen && (
                <div className="absolute right-0 top-full w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link href="/subscriber/strategies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Strategies
                    </Link>
                    <Link href="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Subscription
                    </Link>
                    <Link href="/portfolio-buys" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      New Portfolio Buys
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/register" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Subscribe
            </Link>
            <Link href="/login" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="flex items-center sm:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Home
            </Link>
            <Link href="/strategies" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Strategies
            </Link>
            <Link href="/market-conditions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Market Conditions
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              About
            </Link>
            <Link href="/support" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Support
            </Link>

            {/* Performance links for mobile - Available to everyone */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Performance
              </div>
              <Link href="/performance" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-b border-gray-200">
                📊 All Performance
              </Link>
              <Link href="/performance/candlestick" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Candlestick
              </Link>
              <Link href="/performance/cup-with-handle-double-bottom" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Cup with Handle + Double Bottom
              </Link>
              <Link href="/performance/trend" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Trend
              </Link>
              <Link href="/performance/support-resistance" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Support-Resistance
              </Link>
              <Link href="/performance/midpointtwo" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                MidpointTwo
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <Link href="/performance/transparency" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                🎥 Performance Transparency
              </Link>
            </div>

            {isLoggedIn ? (
              <>
                {/* Admin link for mobile - Only visible to admin users */}
                {isAdmin && (
                  <Link href="/admin/charts" className="block px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-l-4 border-red-500">
                    ⚙️ Admin Charts
                  </Link>
                )}

                <Link href="/subscriber/strategies" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  My Strategies
                </Link>
                <Link href="/subscription" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  My Subscription
                </Link>
                <Link href="/portfolio-buys" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  New Portfolio Buys
                </Link>
                <Link href="/members/charts" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Charts
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Subscribe
                </Link>
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
