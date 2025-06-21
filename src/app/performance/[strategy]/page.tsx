'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import { STRATEGIES } from '@/utils/strategy';
import { buildApiUrl } from '@/config/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush
} from 'recharts';

// TypeScript interfaces
interface ChartData {
  date: string;
  dollar_value: number;
  percent_gain: number;
  formattedDate: string;
}

interface PerformanceData {
  [strategy: string]: {
    date: string;
    dollar_value: number;
    percent_gain: number;
  }[];
}

// TypeScript interfaces for tooltip
interface TooltipPayload {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export default function PerformancePage() {
  const params = useParams();
  const router = useRouter();
  const strategyParam = params.strategy as string;
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [windowWidth, setWindowWidth] = useState(800); // Default width

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validate strategy parameter
  const strategyName = useMemo(() => {
    if (!strategyParam) return null;
    
    // Convert URL param to strategy name (e.g., 'candlestick' -> 'Candlestick')
    const urlToStrategyMap: { [key: string]: string } = {
      'candlestick': 'Candlestick',
      'cup-with-handle-double-bottom': 'Cup with Handle + Double Bottom',
      'trend': 'Trend',
      'support-resistance': 'Support-Resistance',
      'midpointtwo': 'MidpointTwo'
    };
    
    const mappedStrategy = urlToStrategyMap[strategyParam.toLowerCase()];
    
    // Check if the strategy exists in our STRATEGIES list
    if (mappedStrategy && STRATEGIES.includes(mappedStrategy)) {
      return mappedStrategy;
    }
    
    return null;
  }, [strategyParam]);

  // Memoize chart data to prevent re-renders
  const memoizedChartData = useMemo(() => chartData, [chartData]);

  // Calculate Y-axis domain to ensure $10,000 baseline
  const dollarAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [10000, 11000];
    
    const maxValue = Math.max(...chartData.map(d => d.dollar_value));
    const minValue = Math.min(...chartData.map(d => d.dollar_value));
    
    // Always start at $10,000, even if data goes below
    const domainMin = 10000;
    // Add padding to the top, ensure minimum range of $100
    const domainMax = Math.max(maxValue * 1.02, domainMin + 100);
    
    console.log('Domain calculation:', { minValue, maxValue, domainMin, domainMax });
    
    return [domainMin, domainMax];
  }, [chartData]);

  // Calculate perfectly synchronized percentage domain for exact line overlap
  const percentAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 10];
    
    // Get dollar domain range
    const [dollarMin, dollarMax] = dollarAxisDomain;
    const dollarRange = dollarMax - dollarMin;
    
    // PERFECT MATHEMATICAL OVERLAP:
    // Make percentage values scale to exactly match dollar values visually
    // Since $10,000 = 0%, we need percentage max to align with dollar max
    
    // Convert dollar range to equivalent percentage range for visual overlap
    // Dollar range represents the same visual space as percentage range
    const percentMax = (dollarRange / dollarMin) * 100; // Convert to percentage equivalent
    
    console.log('Perfect overlap calculation:', { 
      dollarMin,
      dollarMax,
      dollarRange,
      percentMax: percentMax.toFixed(2)
    });
    
    return [0, percentMax];
  }, [dollarAxisDomain, chartData]);

  // Calculate regular $500 interval Y-axis ticks starting from $10,000
  const dollarAxisTicks = useMemo(() => {
    if (chartData.length === 0) return [10000, 10500, 11000];
    
    const [, max] = dollarAxisDomain;
    
    // Use regular $500 intervals: $10,000, $10,500, $11,000, $11,500, etc.
    const ticks = [];
    let currentTick = 10000; // Always start at $10,000
    
    while (currentTick <= max) {
      ticks.push(currentTick);
      currentTick += 500; // Regular $500 intervals
    }
    
    console.log('Regular $500 interval ticks:', ticks);
    return ticks;
  }, [dollarAxisDomain, chartData.length]);

  // Calculate percentage ticks that follow dollar tick intervals proportionally
  const percentAxisTicks = useMemo(() => {
    if (chartData.length === 0) return [0, 5, 10];
    
    // Calculate percentage ticks that correspond to dollar $500 intervals
    // Each $500 increment should have a corresponding percentage tick
    const dollarTicks = dollarAxisTicks;
    const percentTicks = dollarTicks.map(dollarTick => {
      // Convert dollar value to corresponding percentage value
      const dollarProgress = (dollarTick - 10000) / 10000; // Progress from baseline
      const percentValue = dollarProgress * 100; // Convert to percentage
      return Math.round(percentValue * 10) / 10; // Round to 1 decimal place
    });
    
    console.log('Synchronized percentage ticks:', percentTicks);
    return percentTicks;
  }, [dollarAxisTicks, chartData.length]);

  // Redirect if invalid strategy
  useEffect(() => {
    if (strategyParam && !strategyName) {
      router.push('/performance');
    }
  }, [strategyParam, strategyName, router]);

  // Fetch performance data
  useEffect(() => {
    const fetchDataWrapper = async () => {
      if (!strategyName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(buildApiUrl('/api/performance/data'), {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PerformanceData = await response.json();
        
        // Find data for the current strategy
        const strategyData = data[strategyName];
        
        if (!strategyData || strategyData.length === 0) {
          setError('No data available for this strategy');
          setChartData([]);
          return;
        }
        
        // Transform data for chart
        const transformedData: ChartData[] = strategyData.map(item => ({
          ...item,
          formattedDate: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        }));
        
        setChartData(transformedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch performance data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDataWrapper();
  }, [strategyName]);

  const refreshData = async () => {
    if (!strategyName) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(buildApiUrl('/api/performance/data'), {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch performance data: ${response.status}`);
      }
      
      const allData: PerformanceData = await response.json();
      const strategyData = allData[strategyName];
      
      if (!strategyData || !Array.isArray(strategyData)) {
        throw new Error(`No performance data found for strategy: ${strategyName}`);
      }
      
      const formattedData = strategyData.map((item) => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        })
      }));
      
      setChartData(formattedData);
      toast.success('Performance data refreshed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh performance data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTitle = (strategy: string) => {
    return strategy;
  };

  // Custom tooltip with dark theme
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dollarValue = payload.find((p: TooltipPayload) => p.dataKey === 'dollar_value')?.value;
      const percentValue = payload.find((p: TooltipPayload) => p.dataKey === 'percent_gain')?.value;
      
      if (!dollarValue) return null;
      
      const relativeValue = dollarValue - 10000;
      
      return (
        <div className="bg-gray-800 text-white p-3 border border-gray-600 rounded shadow-md">
          <p className="font-bold text-gray-100 mb-2">{label}</p>
          {dollarValue && (
            <>
              <p className="text-gray-200 font-semibold">
                Portfolio Value: ${dollarValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-gray-300 text-sm">
                P&L: {relativeValue >= 0 ? '+' : ''}${relativeValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </>
          )}
          {percentValue && (
            <p className="text-gray-200 font-semibold">
              Percent Gain: {percentValue?.toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!strategyName) {
    return (
      <main className="min-h-screen bg-white pt-16">
        <Header />
        <div className="text-center py-24 text-gray-500">
          Invalid strategy. Please select a valid strategy.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-6">
            {formatTitle(strategyName)} Performance
          </h1>
          
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        <div className="grid gap-4 sm:gap-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-500">Loading performance data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={refreshData}
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : memoizedChartData.length > 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="max-w-[90vw] sm:max-w-[800px] mx-auto">
                <ResponsiveContainer width="100%" height={windowWidth < 640 ? 400 : 500}>
                  <LineChart
                    data={memoizedChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#4B5563" 
                      opacity={0.5}
                    />
                    <XAxis 
                      dataKey="formattedDate"
                      tick={{ fontSize: windowWidth < 640 ? 10 : 14, fill: '#D1D5DB' }}
                      interval="preserveStartEnd"
                      axisLine={{ stroke: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <YAxis 
                      yAxisId="dollar"
                      orientation="left"
                      tick={{ fontSize: windowWidth < 640 ? 10 : 14, fill: '#F9F7F4' }}
                      domain={dollarAxisDomain}
                      ticks={dollarAxisTicks}
                      type="number"
                      scale="linear"
                      tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                      axisLine={{ stroke: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                      allowDataOverflow={false}
                    />
                    <YAxis 
                      yAxisId="percent"
                      orientation="right"
                      tick={{ fontSize: windowWidth < 640 ? 10 : 14, fill: '#F9F7F4' }}
                      domain={percentAxisDomain}
                      ticks={percentAxisTicks}
                      type="number"
                      scale="linear"
                      tickFormatter={(value: number) => `${value.toFixed(1)}%`}
                      axisLine={{ stroke: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                      allowDataOverflow={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      yAxisId="dollar"
                      type="monotone"
                      dataKey="dollar_value"
                      stroke="#F9F7F4"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F9F7F4' }}
                      activeDot={{ r: 5, stroke: '#F9F7F4', strokeWidth: 2 }}
                      name="Performance"
                    />
                    <Line
                      yAxisId="percent"
                      type="monotone"
                      dataKey="percent_gain"
                      stroke="#F9F7F4"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F9F7F4' }}
                      activeDot={{ r: 5, stroke: '#F9F7F4', strokeWidth: 2 }}
                      name="Performance"
                    />
                    {memoizedChartData.length > 20 && (
                      <Brush 
                        dataKey="formattedDate" 
                        height={30} 
                        stroke="#6B7280"
                        fill="#374151"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-300 space-y-1">
                <p className="font-medium">
                  Starting Capital: <span className="text-gray-100">$10,000</span> | 
                  Current Value: <span className="text-gray-100">${memoizedChartData[memoizedChartData.length - 1]?.dollar_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </p>
                <p className="font-medium">
                  Total Gain: <span className="text-gray-100">{memoizedChartData[memoizedChartData.length - 1]?.percent_gain.toFixed(2)}%</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {memoizedChartData.length > 20 ? 'Use brush below chart to zoom' : `${memoizedChartData.length} data points`}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No performance data available for this strategy.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/performance"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Performance
          </Link>
        </div>
      </div>
    </main>
  );
} 