'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import { getStrategyAbbreviation } from '@/utils/strategy';
import { buildFileUrl, buildApiUrl } from '@/config/api';

function SubscriberChartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const strategy = searchParams.get('strategy');
  const [charts, setCharts] = useState<{ chart1: string | null; chart2: string | null }>({ chart1: null, chart2: null });
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check strategy access - validate both subscription and specific strategy access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // First verify user is logged in
        const userResponse = await fetch(buildApiUrl('/api/user'), {
          credentials: 'include',
        });
        
        if (!userResponse.ok) {
          toast.error('Please log in to view member charts');
          router.push('/login');
          return;
        }

        // Now check strategy-specific access
        const accessUrl = strategy 
          ? `/api/subscription/access?strategy=${encodeURIComponent(strategy)}`
          : '/api/subscription/access';
        
        const accessResponse = await fetch(buildApiUrl(accessUrl), {
          credentials: 'include'
        });
        
        if (!accessResponse.ok) {
          if (accessResponse.status === 401) {
            toast.error('Please log in to view member charts');
            router.push('/login');
            return;
          } else if (accessResponse.status === 403) {
            const errorData = await accessResponse.json();
            if (errorData.strategy_access === false) {
              toast.error(`🚫 Access Denied: You don&apos;t have access to ${strategy} strategy charts`);
              router.push('/subscriber/strategies');
              return;
            } else {
              toast.error('Active subscription required for real-time charts');
              router.push('/subscription');
              return;
            }
          }
          throw new Error(`Access check failed with status ${accessResponse.status}`);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Subscriber Charts: Access check error:', error);
        toast.error('Failed to verify access. Please try logging in again.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router, strategy]);

  useEffect(() => {
    if (!strategy || !isAuthorized) return;
    const abbreviated = getStrategyAbbreviation(strategy);

    const rt1 = `${buildFileUrl(`${abbreviated}-real-time.png`)}?v=${cacheKey}`;
    const rt2 = `${buildFileUrl(`${abbreviated}-real-time-2.png`)}?v=${cacheKey}`;

    Promise.all([
      fetch(rt1).then(res => res.ok ? rt1 : null),
      fetch(rt2).then(res => res.ok ? rt2 : null),
    ]).then(([c1, c2]) => setCharts({ chart1: c1, chart2: c2 }));
  }, [strategy, cacheKey, isAuthorized]);

  const refreshCharts = () => {
    setIsRefreshing(true);
    setCacheKey(Date.now().toString());
    toast.success('Charts refreshed!');
    // Reset loading after a short delay
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Auto-refresh charts every 60 seconds for real-time users
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheKey(Date.now().toString());
    }, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(interval);
  }, []);

  const formatTitle = (raw: string | null) =>
    raw ? raw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying strategy access...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  if (!strategy) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-24 text-gray-500">
          Strategy not specified. Please return to your strategy list.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {formatTitle(strategy)}
        </h1>

        <div className="text-center mb-8">
          <button
            onClick={refreshCharts}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh Charts'}
          </button>
        </div>

        <div className="grid gap-8">
          {charts.chart1 && (
            <Image
              src={charts.chart1}
              alt="Real-Time Chart 1"
              className="w-full border rounded shadow"
              width={800}
              height={600}
              priority
            />
          )}

          {!charts.chart1 && (
            <div className="w-full h-96 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Real-Time Chart 1</h3>
                <p className="text-blue-700 mb-1">No real-time chart uploaded yet</p>
                <p className="text-sm text-blue-600">Member-only charts uploaded via Admin Dashboard</p>
              </div>
            </div>
          )}

          {charts.chart2 && (
            <Image
              src={charts.chart2}
              alt="Real-Time Chart 2"
              className="w-full border rounded shadow"
              width={800}
              height={600}
            />
          )}

          {!charts.chart2 && (
            <div className="w-full h-96 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Real-Time Chart 2</h3>
                <p className="text-blue-700 mb-1">No real-time chart uploaded yet</p>
                <p className="text-sm text-blue-600">Member-only charts uploaded via Admin Dashboard</p>
              </div>
            </div>
          )}

          {!charts.chart1 && !charts.chart2 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-20 w-20 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-medium text-blue-900 mb-2">No Real-Time Charts Available</h3>
              <p className="text-blue-700">Charts for this strategy haven&apos;t been uploaded yet.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/subscriber/strategies"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Strategies
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SubscriberChartPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading charts...</p>
          </div>
        </div>
      </main>
    }>
      <SubscriberChartContent />
    </Suspense>
  );
}
