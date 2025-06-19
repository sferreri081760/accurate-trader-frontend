'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { buildFileUrl } from '@/config/api';

export default function MarketConditionsPage() {
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());
  const [availableCharts, setAvailableCharts] = useState<(string | null)[]>([]);

  const refreshCharts = () => {
    setCacheKey(Date.now().toString());
    checkAvailableCharts();
  };

  const checkAvailableCharts = useCallback(async () => {
    // Check for both delayed and real-time charts in both positions
    const chartOptions = [
      [
        `${buildFileUrl('mc-delayed.png')}?v=${cacheKey}`,
        `${buildFileUrl('mc-real-time.png')}?v=${cacheKey}`
      ],
      [
        `${buildFileUrl('mc-delayed-2.png')}?v=${cacheKey}`,
        `${buildFileUrl('mc-real-time-2.png')}?v=${cacheKey}`
      ]
    ];

    const available = [];
    for (const chartGroup of chartOptions) {
      let foundChart = null;
      // Prefer delayed charts, but fall back to real-time if delayed not available
      for (const chart of chartGroup) {
        try {
          const response = await fetch(chart, { method: 'HEAD' });
          if (response.ok) {
            foundChart = chart;
            break; // Use the first available chart (delayed has priority)
          }
        } catch {
          // Chart doesn't exist, continue to next option
        }
      }
      available.push(foundChart); // Push null if no chart found for this position
    }
    setAvailableCharts(available);
  }, [cacheKey]);

  useEffect(() => {
    checkAvailableCharts();
  }, [cacheKey, checkAvailableCharts]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Market Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            View the latest market conditions charts below.
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
          {[0, 1].map((index) => {
            const chartUrl = availableCharts[index];
            return (
              <div key={index} className="w-full border rounded shadow">
                {chartUrl ? (
                  <Image
                    src={chartUrl}
                    alt={`Market Conditions Chart ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full h-96 border-2 border-dashed border-green-300 rounded-lg bg-green-50 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-green-900 mb-2">Market Conditions Chart {index + 1}</h3>
                      <p className="text-green-700 mb-1">No market analysis chart uploaded yet</p>
                      <p className="text-sm text-green-600">Charts are uploaded via Admin Dashboard</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
