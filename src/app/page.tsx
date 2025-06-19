import Header from '../components/Header';
import HeroSlideshow from '../components/HeroSlideshow';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-0">
          <HeroSlideshow />
        </div>
        <div className="relative z-10 h-full">
          <Header />
        </div>
        
        {/* Get Started Button - Positioned in white space created by image cropping */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <div className="mb-4">
            <p className="text-white text-sm bg-black bg-opacity-40 rounded-lg px-4 py-2 backdrop-blur-sm text-center">
              📱 Follow <a href="https://x.com/accurate_trader" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">@accurate_trader</a> on X for historical trades. <strong>Subscribe here to get ahead of the pack</strong>.
            </p>
          </div>
          <Link 
            href="/strategies" 
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started with 30-day Free Trial
          </Link>
        </div>
      </div>
    </main>
  );
}

// Enhanced SEO metadata for homepage with Open Graph optimization
export const metadata = {
  title: 'Accurate Trader - Professional Algorithmic Trading Strategies',
  description: 'Join Accurate Trader for professional algorithmic trading strategies with backtested results. Real-time signals, performance analytics, and 30-day free trial.',
  openGraph: {
    title: 'Accurate Trader - Professional Algorithmic Trading Strategies',
    description: 'Join Accurate Trader for professional algorithmic trading strategies with backtested results. Real-time signals, performance analytics, and 30-day free trial.',
    url: 'https://accurate-trader.vercel.app',
    images: [
      {
        url: '/images/SPY 0526P.png',
        width: 1200,
        height: 630,
        alt: 'Accurate Trader - Professional Trading Strategy Performance',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accurate Trader - Professional Algorithmic Trading Strategies',
    description: 'Join Accurate Trader for professional algorithmic trading strategies with backtested results. 30-day free trial available.',
    images: ['/images/SPY 0526P.png'],
  },
};
