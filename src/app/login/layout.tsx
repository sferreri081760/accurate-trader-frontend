import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accurate Trader - Login',
  description: 'Login to access your subscribed trading strategies and real-time charts.',
  keywords: 'trading login, trading strategies, real-time charts, trading signals, market analysis',
  openGraph: {
    title: 'Accurate Trader - Login',
    description: 'Login to access your subscribed trading strategies and real-time charts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accurate Trader - Login',
    description: 'Login to access your subscribed trading strategies and real-time charts.',
  }
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 