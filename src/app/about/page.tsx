import Link from 'next/link';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6 text-center">
            About Accurate Trader
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-left">
            Inspired by the legendary William J. O&apos;Neil and his pioneering work in chart pattern identification, 
            particularly his focus on Cup-with-Handle and Double-Bottom chart patterns, Accurate Trader represents 
            the natural evolution of his methodology.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6 text-left">
            After integrating those methods into the 21st century, with all the complex interactive factors in today&apos;s markets: technical, economic, and political, we felt that just a handful of chart patterns was incomplete.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6 text-left">
            So we took the concept to its logical conclusion: an extension of the timeless search for chart patterns that have historically shown a high likelihood for rapid price advance (or decline), now enhanced with modern algorithmic precision and 
            institutional-grade risk management.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">🎯 Transparency First</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every strategy comes with complete performance history, risk metrics, and real-time 
                  transparency. No black boxes, no hidden parameters - just authentic results.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">⚡ Institutional Quality</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our strategies are built with sophisticated multi-layer confirmation systems 
                  and professional-grade risk management protocols.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">📊 Real Performance</h3>
                <p className="text-gray-700 leading-relaxed">
                  All performance data comes directly from live TradeStation exports. 
                  Watch our transparency video to see the complete data pipeline.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">🛡️ Risk Management</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every strategy includes multiple exit protection layers with adaptive 
                  position sizing based on market volatility and account risk parameters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5 Trading Strategies</h3>
              <p className="text-gray-600">
                From candlestick patterns to advanced momentum systems, each strategy 
                offers unique market opportunities with institutional-grade complexity.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Analytics</h3>
              <p className="text-gray-600">
                Interactive charts showing cumulative returns, drawdown analysis, 
                and comprehensive performance metrics for informed decision-making.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Subscriptions</h3>
              <p className="text-gray-600">
                Choose your strategies, cancel anytime, and enjoy a 30-day free trial 
                to experience our platform risk-free.
              </p>
            </div>
          </div>
        </div>

        {/* Community & Priority Access */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community & Priority Access</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                📱 Follow <a href="https://x.com/accurate_trader" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-medium">@accurate_trader</a> on X for historical trades and market insights. 
                As a subscriber, you&apos;ll receive priority focus over our X followers - ensuring you get the best analysis and fastest updates.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">X (Twitter) Followers</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Historical trade results and analysis</li>
                  <li>• Market commentary and insights</li>
                  <li>• General trading education content</li>
                  <li>• Community discussions and updates</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Priority Subscribers</h3>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li>• <strong>Real-time strategy signals and alerts</strong></li>
                  <li>• <strong>Priority access to new strategies</strong></li>
                  <li>• <strong>Detailed performance analytics</strong></li>
                  <li>• <strong>Direct support and fastest updates</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Trading Strategies</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Candlestick Strategy</h3>
                <p className="text-gray-600 text-sm">Multi-confirmation hammer pattern system</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🏆 Cup with Handle + Double Bottom</h3>
                <p className="text-gray-600 text-sm">Dual-pattern recognition system</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Trend Strategy</h3>
                <p className="text-gray-600 text-sm">Dynamic trendline breakout system</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Support-Resistance</h3>
                <p className="text-gray-600 text-sm">Multi-methodology detection system</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ MidpointTwo - The Crown Jewel</h3>
                <p className="text-gray-600 text-sm">Advanced multi-timeframe midpoint detection engine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Built with Modern Technology</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 13+ with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for modern styling</li>
                  <li>• React with custom components</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend & Infrastructure</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Flask API with JWT authentication</li>
                  <li>• Stripe & PayPal payment integration</li>
                  <li>• Secure file upload handling</li>
                  <li>• CORS support for seamless operation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of traders using our institutional-quality strategies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/strategies"
                className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                Explore Strategies
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-lg text-green-600 bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: 'About - Accurate Trader',
  description: 'Learn about Accurate Trader\'s mission to democratize professional-grade algorithmic trading strategies with complete transparency.',
}; 