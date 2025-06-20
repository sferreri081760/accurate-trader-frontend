'use client';

// Import necessary components and libraries
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Strategy } from '@/types/strategy';
import { buildApiUrl } from '@/config/api';

// Main component for the strategies page
export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const res = await fetch(buildApiUrl('/api/strategies'));
        
        if (!res.ok) {
          throw new Error('Failed to fetch strategies');
        }
        
        const data = await res.json();
        setStrategies(data);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        // You could set an error state here if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  // Utility function to convert strategy name to URL-friendly format
  function formatStrategyUrl(name: string): string {
    return name.toLowerCase()
      .replace(/[+]/g, ' ') // Replace '+' with space
      .replace(/\s+/g, '-'); // Replace sequences of spaces with a single hyphen
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading strategies...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Include the Header component at the top of the page */}
      <Header />
      
      {/* Strategies page content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Trading Strategies
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our collection of backtested trading strategies with real-time entry/exit signals, 
            active only during favorable market conditions.
          </p>
        </div>

        {/* Strategies list displayed in a responsive grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy, index) => {
            // Convert strategy name to URL-friendly format
            const strategyUrl = formatStrategyUrl(strategy.name);
            
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Strategy name */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {strategy.pageTitle || strategy.name}
                  </h2>
                  
                  {/* Strategy description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {strategy.introduction || strategy.description}
                  </p>
                  
                  {/* Key metrics summary */}
                  {strategy.metrics && (
                    <div className="grid grid-cols-3 gap-y-2 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Profit Factor:</span>
                        <span className="ml-1 font-medium">
                          {strategy.metrics.profitFactor.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Return:</span>
                        <span className="ml-1 text-green-600 font-medium">
                          {strategy.metrics.totalReturn.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Drawdown:</span>
                        <span className="ml-1 text-red-500 font-medium">
                          {strategy.metrics.maxDrawdown.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Performance info for strategies without metrics */}
                  {!strategy.metrics && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">{strategy.performance}</p>
                    </div>
                  )}

                  {/* Action links - View details and Charts */}
                  <div className="flex gap-x-4">
                    {/* View details link */}
                    <Link
                      href={`/strategies/${strategyUrl}`}
                      className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
                    >
                      View details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    {/* Charts link */}
                    <Link
                      href={`/strategies/${strategyUrl}/charts`}
                      className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
                    >
                      Charts
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1-1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state - shown if no strategies are found */}
        {strategies.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-blue-50 rounded-lg">
            <p className="text-gray-600">No strategies found. Please make sure the backend server is running.</p>
            <p className="text-gray-500 mt-2 text-sm">
              Backend URL: {buildApiUrl('/api/strategies')}
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 