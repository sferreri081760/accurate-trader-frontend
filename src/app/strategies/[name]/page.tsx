import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import StrategyClient from './strategyclient';
import { Strategy } from '@/types/strategy';
import { buildApiUrl } from '@/config/api';



// This function fetches a specific strategy from the backend API
async function getStrategy(name: string): Promise<Strategy | null> {
  try {
    const res = await fetch(buildApiUrl('/api/strategies'), {
      ...(process.env.NODE_ENV === 'development' 
        ? { cache: 'no-store' as const }
        : { cache: 'force-cache' as const, next: { revalidate: 3600 } }
      )
    });
    if (!res.ok) throw new Error('Failed to fetch strategies');
    const strategies: Strategy[] = await res.json();
    const normalizedUrlName = name.toLowerCase();
    const strategy = strategies.find((s) => {
      const strategyUrlName = s.name.toLowerCase()
        .replace(/[+]/g, ' ')
        .replace(/\s+/g, '-');
      return strategyUrlName === normalizedUrlName;
    });
    return strategy || null;
  } catch (error) {
    console.error('Error fetching strategy:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const strategy = await getStrategy(name);
  if (strategy) {
    return {
      title: `Accurate Trader - ${strategy.name}`,
      description: `Explore ${strategy.name} strategy with backtested metrics and real-time signals for algorithmic trading.`,
    };
  }
  const formattedName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `Accurate Trader - ${formattedName}`,
    description: `Explore ${formattedName} strategy with backtested metrics and real-time signals for algorithmic trading.`,
  };
}

export default async function StrategyPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const strategy = await getStrategy(name);
  if (!strategy || !strategy.metrics) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>}>
      <StrategyClient name={name} strategy={strategy as Required<Strategy>} />
    </Suspense>
  );
}
