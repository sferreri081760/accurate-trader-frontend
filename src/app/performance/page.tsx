'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { STRATEGIES } from '@/utils/strategy';

export default function PerformanceOverviewPage() {
  // Map strategy names to URL-friendly slugs
  const strategyToUrl = (strategy: string): string => {
    const urlMap: { [key: string]: string } = {
      'Candlestick': 'candlestick',
      'Cup with Handle + Double Bottom': 'cup-with-handle-double-bottom',
      'Trend': 'trend',
      'Support-Resistance': 'support-resistance',
      'MidpointTwo': 'midpointtwo'
    };
    return urlMap[strategy] || strategy.toLowerCase().replace(/\s+/g, '-');
  };

  // Filter out non-performance strategies
  const performanceStrategies = STRATEGIES.filter(strategy => 
    !['Portfolio Buys', 'Market Conditions'].includes(strategy)
  );

  return (
    <main className="min-h-screen bg-white pt-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Strategy Performance
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View detailed performance charts for each trading strategy, including dollar value growth and percentage gains over time.
          </p>
        </div>

        {/* Performance Transparency Section */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">
                Performance Transparency
              </h2>
            </div>
            <p className="text-gray-700 mb-4 max-w-3xl mx-auto">
              See the complete end-to-end process: from TradeStation data exports to Google Sheets conversion, 
              backend processing, and real-time chart generation.
            </p>
            <Link
              href="/performance/transparency"
              className="inline-flex items-center bg-white border border-green-300 rounded-lg px-4 py-2 hover:bg-green-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 0a4 4 0 118 0H8z" />
              </svg>
              <span className="text-green-700 font-semibold">Watch Transparency Demo</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {performanceStrategies.map((strategy) => (
            <Link
              key={strategy}
              href={`/performance/${strategyToUrl(strategy)}`}
              className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 hover:border-green-300"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {strategy}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  View performance charts and analytics
                </p>
                <div className="inline-flex items-center text-green-600 font-medium">
                  View Performance
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              About Performance Data
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              All performance charts start with a $10,000 initial capital and show cumulative profit/loss over time. 
              The charts display both dollar values (left axis) and percentage gains (right axis) to provide comprehensive performance insights.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 