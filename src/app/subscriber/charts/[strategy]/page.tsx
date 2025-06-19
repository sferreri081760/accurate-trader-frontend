import { Suspense } from 'react';
import { STRATEGIES } from '@/utils/strategy';
import SubscriberChartContent from './SubscriberChartContent';

// Generate static params for all possible strategy routes - SERVER COMPONENT
export async function generateStaticParams() {
  const normalizeSlug = (name: string) =>
    name.toLowerCase().replace(/[+]/g, ' ').replace(/\s+/g, '-');

  return STRATEGIES.map((strategy) => ({
    strategy: normalizeSlug(strategy),
  }));
}

// Server component wrapper
export default function SubscriberChartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriberChartContent />
    </Suspense>
  );
} 