'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function PerformanceTransparencyPage() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Performance Transparency
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See exactly how our performance data flows from TradeStation exports to the interactive charts you see on this platform.
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden mb-12">
          <div className="p-6 sm:p-8">
            {/* Personal Introduction */}
            <div className="text-center mb-6 bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-lg p-4 border border-blue-500/30">
              <p className="text-blue-300 text-lg font-medium italic">
                Hi, I&apos;m Steve, founder of Accurate Trader. The narration uses my AI voice avatar to provide clear delivery of our demonstration.
              </p>
              <p className="text-blue-200 text-sm mt-2 italic">
                Note: This video shows dual-plotted charts for demonstration purposes. Our live performance charts use synchronized scaling where both dollar and percentage values appear as a single line for cleaner visualization.
              </p>
            </div>
            
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <a 
                href="https://www.youtube.com/watch?v=EaRr14UBJY0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-red-600 text-white text-lg font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch Transparency Video on YouTube
              </a>
              <p className="text-gray-400 text-sm mt-4">
                Click to view our complete data processing pipeline demonstration
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 text-lg max-w-4xl mx-auto">
                This video demonstrates our complete data processing pipeline: from raw TradeStation exports, 
                through Google Sheets conversion, backend processing, to the final interactive performance charts.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TradeStation Export</h3>
            <p className="text-gray-600 text-sm">
              Raw trading data exported directly from TradeStation platform in Excel format
            </p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Sheets Conversion</h3>
            <p className="text-gray-600 text-sm">
              Upload to Google Drive and convert to CSV format for standardized processing
            </p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend Processing</h3>
            <p className="text-gray-600 text-sm">
              Real-time data validation, parsing, and cumulative performance calculations
            </p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Charts</h3>
            <p className="text-gray-600 text-sm">
              Professional visualization with dark themes, dual axes, and mobile responsiveness
            </p>
          </div>
        </div>

        {/* Why Transparency Matters */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Complete Transparency Matters
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Trust</h3>
                  <p className="text-gray-600">
                    See exactly where our performance data comes from - no cherry-picking, no manipulation, just raw TradeStation exports.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Excellence</h3>
                  <p className="text-gray-600">
                    Demonstrate our professional data processing pipeline with real-time validation and error handling.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry First</h3>
                  <p className="text-gray-600">
                    No other trading service shows their complete data processing workflow - we&apos;re setting a new standard for transparency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Value</h3>
                  <p className="text-gray-600">
                    Learn about professional data processing, validation techniques, and chart visualization best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Links Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎯 Learn More About Our Trading Strategies
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            The transparency video shows our data processing pipeline. Now explore the individual strategies that generate this performance data.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/strategies/candlestick" className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">📈 Candlestick Strategy</h3>
              <p className="text-sm text-gray-600 mt-1">Multi-confirmation hammer pattern system</p>
            </Link>
            
            <Link href="/strategies/cup-with-handle-double-bottom" className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">🏆 Cup with Handle + Double Bottom</h3>
              <p className="text-sm text-gray-600 mt-1">Dual-pattern recognition with triple-exit protection</p>
            </Link>
            
            <Link href="/strategies/trend" className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">📊 Trend Following</h3>
              <p className="text-sm text-gray-600 mt-1">Dynamic trendline breakout system</p>
            </Link>
            
            <Link href="/strategies/support-resistance" className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">🎯 Support-Resistance</h3>
              <p className="text-sm text-gray-600 mt-1">Multi-methodology detection system</p>
            </Link>
            
            <Link href="/strategies/midpointtwo" className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">⚡ MidpointTwo</h3>
              <p className="text-sm text-gray-600 mt-1">Advanced multi-timeframe midpoint detection engine</p>
            </Link>
            
            <Link href="/strategies" className="group p-4 rounded-lg border border-green-300 bg-green-50 hover:bg-green-100 transition-all">
              <h3 className="font-semibold text-green-700">🚀 View All Strategies</h3>
              <p className="text-sm text-green-600 mt-1">Complete strategy overview and comparisons</p>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to See Our Performance Data?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Explore our interactive performance charts with complete confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/performance"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              📊 View All Performance
            </Link>
            <Link
              href="/strategies"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              🎯 Browse Strategies
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/performance"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Performance
          </Link>
        </div>
      </div>
    </main>
  );
} 