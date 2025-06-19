import { Metadata } from 'next';
import { buildApiUrl } from '@/config/api';

// Generate static params for all strategy chart pages
export async function generateStaticParams() {
  // Strategy names that should be pre-generated as static pages
  return [
    { name: 'c-w-h' },
    { name: 'double-bottom' },
    { name: 'triple-h' },
    { name: 'candlestick' },
    { name: 'cup-with-handle-double-bottom' },
    { name: 'trend' },
    { name: 'support-resistance' },
    { name: 'midpointtwo' }
  ];
}

interface Strategy {
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
}

// Function to fetch strategy data
async function getStrategyByName(name: string): Promise<Strategy | null> {
  try {
          const res = await fetch(buildApiUrl('/api/strategies'), {
      cache: 'force-cache'
    });
    if (!res.ok) throw new Error('Failed to fetch strategies');
    const strategies: Strategy[] = await res.json();
    const normalizedUrlName = name.toLowerCase();
    const strategy = strategies.find((s: Strategy) => {
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

  const strategy = await getStrategyByName(name);

  if (strategy) {
    return {
      title: `Accurate Trader - ${strategy.name} Charts`,
      description: `View stock charts for ${strategy.name} strategy with backtested performance metrics.`
    };
  }

  const formattedName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Accurate Trader - ${formattedName} Charts`,
    description: `View stock charts for ${formattedName} strategy with backtested performance metrics.`
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
