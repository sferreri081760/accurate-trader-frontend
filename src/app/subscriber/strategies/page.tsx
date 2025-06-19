'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Link from 'next/link';
import { buildApiUrl } from '@/config/api';

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

export default function SubscriberStrategiesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [availableStrategies, setAvailableStrategies] = useState<Strategy[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userResponse = await fetch(buildApiUrl('/api/user'), {
          credentials: 'include',
        });
        
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            await new Promise(resolve => setTimeout(resolve, 300));
            userResponse = await fetch(buildApiUrl('/api/user'), {
              credentials: 'include',
            });

            if (!userResponse.ok) {
            router.push('/login');
            return;
          }
          } else {
          throw new Error('Failed to fetch user data');
        }
        }

        const userDataResponse = await userResponse.json();
        setSelectedStrategies(userDataResponse.strategies);
        
        const strategiesResponse = await fetch(buildApiUrl('/api/strategies'));
        if (!strategiesResponse.ok) {
          throw new Error('Failed to fetch strategies');
        }

        const strategies = await strategiesResponse.json();
        setAvailableStrategies(strategies);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleStrategyToggle = (strategyName: string) => {
    setSelectedStrategies(prev =>
      prev.includes(strategyName)
        ? prev.filter(name => name !== strategyName)
        : [...prev, strategyName]
    );
  };

  const normalizeSlug = (name: string) =>
    name.toLowerCase().replace(/[+]/g, ' ').replace(/\s+/g, '-');

  const handleUpdateSubscription = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(buildApiUrl('/api/subscription/update'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          strategies: selectedStrategies,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to update subscription');
      }

      const data = await response.json();
      toast.success(`Subscription updated successfully! New monthly price: $${data.monthly_price}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription. Please try again.');
      router.push('/login');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your strategies...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Your Trading Strategies
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your subscribed trading strategies. Select the strategies you want to access.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableStrategies.map((strategy) => {
              const slug = normalizeSlug(strategy.name);
              return (
            <div
              key={strategy.name}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedStrategies.includes(strategy.name)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => handleStrategyToggle(strategy.name)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(strategy.name)}
                      onChange={() => handleStrategyToggle(strategy.name)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {strategy.pageTitle || strategy.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {strategy.introduction || strategy.description}
                      </p>
                      <div className="mt-2 text-sm">
                        <div>
                          <span className="text-gray-500">Profit Factor:</span>
                          <span className="ml-1 font-medium">
                            {strategy.metrics.profitFactor.toFixed(2)}
                          </span>
                    </div>
                  </div>
                      <div className="mt-3 space-x-4">
                        <Link href={`/strategies/${slug}?from=subscriber`} className="text-blue-600 hover:underline text-sm">
                          View Details
                        </Link>
                        {selectedStrategies.includes(strategy.name) && (
                          <Link href={`/subscriber/charts/${slug}`} className="text-green-600 hover:underline text-sm">
                            View Charts
                          </Link>
                        )}
                  </div>
                    </div>
                  </div>
                  </div>
              );
            })}
        </div>

          <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpdateSubscription}
            disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Subscription'
              )}
          </button>
        </div>
        </div>
      </div>
    </main>
  );
}
