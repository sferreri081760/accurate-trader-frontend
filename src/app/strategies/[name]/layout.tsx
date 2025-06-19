// Generate static params for all strategy pages
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

export default function StrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 