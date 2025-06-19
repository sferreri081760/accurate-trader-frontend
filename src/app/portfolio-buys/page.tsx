'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { buildFileUrl, buildApiUrl } from '@/config/api';
import { toast } from 'react-hot-toast';

export default function PortfolioBuysPage() {
  const router = useRouter();
  const [cacheKey, setCacheKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [availableCharts, setAvailableCharts] = useState<boolean[]>([false, false, false, false]);

  // Initialize cache key only on client side to avoid hydration mismatch
  useEffect(() => {
    setCacheKey(Date.now().toString());
  }, []);

  // Check member access - proper subscription checking with admin support
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // First verify user is logged in
        const userResponse = await fetch(buildApiUrl('/api/user'), {
          credentials: 'include',
        });
        
        if (!userResponse.ok) {
          toast.error('Please log in to view portfolio buys');
          router.push('/login');
          return;
        }

        // Now check subscription access (backend handles admin automatically)
        const accessResponse = await fetch(buildApiUrl('/api/subscription/access'), {
          credentials: 'include'
        });
        
        if (!accessResponse.ok) {
          if (accessResponse.status === 401) {
            toast.error('Please log in to view portfolio buys');
            router.push('/login');
            return;
          } else if (accessResponse.status === 403) {
            toast.error('Active subscription required for portfolio buys');
            router.push('/subscription');
            return;
          }
          throw new Error(`Access check failed with status ${accessResponse.status}`);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Portfolio Buys: Access check error:', error);
        toast.error('Failed to verify access. Please try logging in again.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // Check which charts are available
  useEffect(() => {
    if (!isAuthorized || !cacheKey) return;

    const checkChartAvailability = async () => {
      const chartFiles = [
        `pb-real-time.png?v=${cacheKey}`,
        `pb-real-time-2.png?v=${cacheKey}`,
        `pb-delayed.png?v=${cacheKey}`,
        `pb-delayed-2.png?v=${cacheKey}`
      ];

      const availability = await Promise.all(
        chartFiles.map(async (file) => {
          try {
            const response = await fetch(buildFileUrl(file), { method: 'HEAD' });
            return response.ok;
          } catch {
            return false;
          }
        })
      );

      setAvailableCharts(availability);
    };

    checkChartAvailability();
  }, [isAuthorized, cacheKey]);

  const refreshCharts = () => {
    setCacheKey(Date.now().toString());
    toast.success('Charts refreshed!');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking access...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  const chartUrls = [
    `${buildFileUrl('pb-real-time.png')}?v=${cacheKey}`,
    `${buildFileUrl('pb-real-time-2.png')}?v=${cacheKey}`,
    `${buildFileUrl('pb-delayed.png')}?v=${cacheKey}`,
    `${buildFileUrl('pb-delayed-2.png')}?v=${cacheKey}`
  ];

  const chartLabels = [
    'Same-Day Buy Signal 1',
    'Same-Day Buy Signal 2', 
    'Same-Day Buy Signal 3',
    'Same-Day Buy Signal 4'
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            New Portfolio Buys
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
            Same-day portfolio buy signals and opportunities for members
          </p>
          <p className="text-sm text-blue-600 font-medium">
            🔒 Member-Only Access
          </p>
          <div className="mt-6">
            <button
              onClick={refreshCharts}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Charts
            </button>
          </div>
        </div>

        <div className="grid gap-8">
          {chartUrls.map((chartUrl, index) => (
            <div key={index}>
              {availableCharts[index] ? (
                <Image
                  src={chartUrl}
                  alt={chartLabels[index]}
                  className="w-full border rounded shadow"
                  width={800}
                  height={600}
                  priority={index < 2}
                />
              ) : (
                <div className="w-full h-96 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-lg font-medium text-purple-900 mb-2">{chartLabels[index]}</h3>
                    <p className="text-purple-700 mb-1">No buy signal uploaded yet</p>
                    <p className="text-sm text-purple-600">Charts uploaded via Admin Dashboard</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/subscriber/strategies"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Member Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
} 