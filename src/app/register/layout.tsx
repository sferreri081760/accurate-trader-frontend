import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accurate Trader - Register',
  description: 'Register to access trading strategies with real-time charts and signals.',
  keywords: 'trading strategies, real-time charts, trading signals, market analysis, technical analysis',
  openGraph: {
    title: 'Accurate Trader - Register',
    description: 'Register to access trading strategies with real-time charts and signals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accurate Trader - Register',
    description: 'Register to access trading strategies with real-time charts and signals.',
  }
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 