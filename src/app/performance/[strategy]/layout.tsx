// Generate static params for all strategy performance pages
export async function generateStaticParams() {
  // Strategy names that should be pre-generated as static pages
  return [
    { strategy: 'candlestick' },
    { strategy: 'cup-with-handle-double-bottom' },
    { strategy: 'trend' },
    { strategy: 'support-resistance' },
    { strategy: 'midpointtwo' }
  ];
}

export default function PerformanceStrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 