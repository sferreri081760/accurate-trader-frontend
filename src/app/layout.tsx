import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Accurate Trader - Professional Algorithmic Trading Strategies",
  description: "Professional algorithmic trading strategies with backtested results. Real-time signals, performance analytics, and 30-day free trial. Join Accurate Trader today.",
  keywords: "algorithmic trading, trading strategies, backtested strategies, real-time signals, performance analytics, market analysis, technical analysis, trading platform",
  authors: [{ name: "Accurate Trader" }],
  creator: "Accurate Trader",
  publisher: "Accurate Trader",
  metadataBase: new URL('https://accurate-trader.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://accurate-trader.vercel.app',
    siteName: 'Accurate Trader',
    title: 'Accurate Trader - Professional Algorithmic Trading Strategies',
    description: 'Professional algorithmic trading strategies with backtested results. Real-time signals, performance analytics, and 30-day free trial.',
    images: [
      {
        url: '/images/SPY 0526P.png',
        width: 1200,
        height: 630,
        alt: 'Accurate Trader - SPY Strategy Performance Chart',
        type: 'image/png',
      },
      {
        url: '/images/SMCI M TOP0129P.png',
        width: 1200,
        height: 630,
        alt: 'Accurate Trader - SMCI Trading Strategy',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accurate Trader - Professional Algorithmic Trading Strategies',
    description: 'Professional algorithmic trading strategies with backtested results. Real-time signals, performance analytics, and 30-day free trial.',
    creator: '@accurate_trader',
    site: '@accurate_trader',
    images: ['/images/SPY 0526P.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.paypal.com https://www.paypalobjects.com https://js.stripe.com https://checkout.stripe.com https: http: data: blob:; object-src 'none'; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http: wss: ws:; font-src 'self' https: http: data:; media-src 'self' https: http: data: blob:; frame-src 'self' https:;"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
