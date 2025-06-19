'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ParametersSection from '@/components/ParametersSection';
import { buildApiUrl } from '@/config/api';

interface StrategyClientProps {
  name: string;
  strategy: {
    name: string;
    description: string;
    pageTitle?: string;
    introduction?: string;
    howItWorks?: string;
    riskManagement?: string;
    parameters?: { name: string; description: string }[];
    metrics: {
      profitFactor: number;
      winRate: number;
      totalReturn: number;
      maxDrawdown: number;
    };
    notes: string;
  };
}

export default function StrategyClient({ name, strategy }: StrategyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const strategySlug = name;
  const fromSubscriber = searchParams.get('from') === 'subscriber';

  const handleStartTrading = async () => {
    try {
              const res = await fetch(buildApiUrl('/api/user'), {
        credentials: 'include',
      });
      if (res.ok) {
        router.push(`/subscriber/strategies?strategy=${encodeURIComponent(strategySlug)}`);
      } else {
        router.push(`/register?strategy=${encodeURIComponent(strategySlug)}`);
      }
    } catch {
      console.error('Redirect fallback.');
      router.push(`/register?strategy=${encodeURIComponent(strategySlug)}`);
    }
  };

  const pageTitle = strategy.pageTitle || `${strategy.name} Strategy`;
  const introduction = strategy.introduction || strategy.description;
  const howItWorks = strategy.howItWorks || 'Detailed explanation coming soon.';
  const riskManagement = strategy.riskManagement || 'Risk info coming soon.';
  const parameters = strategy.parameters || [];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mb-4">{pageTitle}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{strategy.description}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-12 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Profit Factor</p>
              <p className="text-2xl font-bold text-gray-900">{strategy.metrics.profitFactor.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Total Return</p>
              <p className="text-2xl font-bold text-green-600">{strategy.metrics.totalReturn.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-500">{strategy.metrics.maxDrawdown.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Transparency Video Link */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-12 border border-green-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">🎥 See Our Transparency in Action</h3>
              <p className="text-gray-700 text-sm mb-3">
                Watch our live trading transparency video showing the complete data processing pipeline from TradeStation to performance charts
              </p>
              <Link 
                href="/performance/transparency" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm group"
              >
                View Transparency Video
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-base text-gray-600 leading-relaxed">{introduction}</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-base text-gray-600 leading-relaxed">{howItWorks}</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Management</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-base text-gray-600 leading-relaxed">{riskManagement}</p>
          </div>
        </section>

        {parameters.length > 0 && (
          <div className="mb-12">
            <ParametersSection title="Key Parameters" parameters={parameters} />
          </div>
        )}

        {strategy.notes && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Notes</h2>
            <p className="text-gray-600">{strategy.notes}</p>
          </div>
        )}

        <div className="text-center mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleStartTrading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Start Trading with This Strategy
            </button>
            <Link
              href={`/performance/${name}`}
              className="inline-flex items-center px-6 py-3 border border-purple-300 text-base font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 shadow-sm transition-colors"
            >
              📊 View Performance Data
            </Link>
            <Link
              href={`/strategies/${name}/charts`}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
            >
              📈 View Charts
            </Link>
          </div>
        </div>

        <div className="text-center">
          {fromSubscriber ? (
            <Link href="/subscriber/strategies" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to My Strategies
            </Link>
          ) : (
            <Link href="/strategies" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to All Strategies
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
