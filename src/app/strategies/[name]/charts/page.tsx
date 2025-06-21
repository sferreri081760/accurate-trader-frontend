'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';


// Interface for strategy data
interface Strategy {
  name: string;
  description: string;
  pageTitle?: string;
  introduction?: string;
  metrics: {
    profitFactor: number;
    winRate: number;
    totalReturn: number;
    maxDrawdown: number;
  };
}

// Interface for params
interface StrategyParams {
  name: string;
}



export default function StrategyChartsPage({ params }: { params: Promise<StrategyParams> }) {
  const router = useRouter();
  // Properly unwrap params with React.use()
  const unwrappedParams = use(params);
  const strategyName = unwrappedParams.name;
  
  const [isLoading, setIsLoading] = useState(true);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());
  
  // Chart URL state - must be declared at component level
  const [chartUrl1, setChartUrl1] = useState<string>('');
  const [chartUrl2, setChartUrl2] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { buildApiUrl } = await import('@/config/api');
        
        // Check if user is logged in
        const token = Cookies.get('token');
        let currentUserData = null;
        
        if (!token) {
          setIsSubscribed(false);
          // Continue loading strategy data for public view
        } else {
          // Fetch user data to check subscription
          const userResponse = await fetch(buildApiUrl('/api/user'), {
            credentials: 'include'
          });

          if (!userResponse.ok) {
            if (userResponse.status === 401) {
              toast.error('Please log in to view charts');
              router.push('/login');
              return;
            }
            throw new Error('Failed to fetch user data');
          }

          currentUserData = await userResponse.json();
        }

        // Fetch strategy data
        const strategyResponse = await fetch(buildApiUrl('/api/strategies'));
        if (!strategyResponse.ok) {
          throw new Error('Failed to fetch strategies');
        }

        const strategies = await strategyResponse.json();
        const strategy = strategies.find((s: Strategy) => 
          normalizeStrategyName(s.name) === strategyName
        );

        if (!strategy) {
          router.push('/strategies');
          return;
        }

        setStrategy(strategy);
        if (currentUserData) {
          setIsSubscribed(currentUserData.strategies.includes(strategy.name));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [strategyName, router]);

  const normalizeStrategyName = (name: string) => {
    return name.toLowerCase().replace(/\+/g, ' ').replace(/\s+/g, '-');
  };

  const refreshCharts = () => {
    setIsLoading(true);
    setCacheKey(Date.now().toString());
    toast.success('Charts refreshed!');
    // Reset loading after a short delay to allow chart reload
    setTimeout(() => setIsLoading(false), 500);
  };

  // Auto-refresh charts every 10 minutes for real-time users
  useEffect(() => {
    if (!isSubscribed) return; // Only auto-refresh for subscribed users
    
    const interval = setInterval(() => {
      setCacheKey(Date.now().toString());
    }, 600000); // Refresh every 10 minutes
    
    return () => clearInterval(interval);
  }, [isSubscribed]);

  // Load chart URLs based on strategy and subscription status
  useEffect(() => {
    const loadChartUrls = async () => {
      if (!strategy) return;
      
      try {
        // Public strategy pages ALWAYS show delayed charts
        // Subscribers should use /subscriber/charts for real-time access
        const chartType = 'delayed';
        const { getChartUrl } = await import('@/utils/chartFallback');
        const url1 = getChartUrl({
          strategy: strategy.name,
          type: chartType,
          chartNumber: 1,
          cacheKey
        });
        const url2 = getChartUrl({
          strategy: strategy.name,
          type: chartType,
          chartNumber: 2,
          cacheKey
        });
        setChartUrl1(url1);
        setChartUrl2(url2);
      } catch (error) {
        console.error('Error loading chart URLs:', error);
        // Clear chart URLs on error - no fallback to mock images
        setChartUrl1('');
        setChartUrl2('');
      }
    };
    
    loadChartUrls();
  }, [strategy, cacheKey]); // Removed isSubscribed dependency since we always show delayed

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading charts...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!strategy) {
    return null;
  }



  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {strategy.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Delayed performance charts - {isSubscribed 
              ? 'For same-day access, visit your Member Dashboard'
              : 'Subscribe for same-day access via Member Dashboard'}
          </p>
          
          <div className="mt-6">
            <button
              onClick={refreshCharts}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Refreshing...' : 'Refresh Charts'}
            </button>
          </div>
        </div>

        <div className="grid gap-8">
          {chartUrl1 ? (
            <Image
              src={chartUrl1}
              alt={`${strategy.name} Chart 1`}
              className="w-full border rounded shadow"
              width={800}
              height={600}
              priority
            />
          ) : (
            <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delayed Chart 1
                </h3>
                <p className="text-gray-600 mb-1">No chart uploaded yet</p>
                <p className="text-sm text-gray-500">Charts are uploaded via Admin Dashboard</p>
              </div>
            </div>
          )}
          
          {chartUrl2 ? (
            <Image
              src={chartUrl2}
              alt={`${strategy.name} Chart 2`}
              className="w-full border rounded shadow"
              width={800}
              height={600}
            />
          ) : (
            <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delayed Chart 2
                </h3>
                <p className="text-gray-600 mb-1">No chart uploaded yet</p>
                <p className="text-sm text-gray-500">Charts are uploaded via Admin Dashboard</p>
              </div>
            </div>
          )}
        </div>

        {!isSubscribed && (
          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
            >
              Subscribe for Same-Day Access
            </Link>
          </div>
        )}

        {isSubscribed && (
          <div className="mt-8 text-center">
            <Link
              href="/subscriber/strategies"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              View Real-Time Charts in Member Dashboard
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href={`/strategies/${strategyName}`}
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Strategy Details
          </Link>
        </div>
      </div>
    </main>
  );
} 