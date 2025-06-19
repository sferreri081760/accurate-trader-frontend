// Import necessary components
import Link from 'next/link';
import Header from '@/components/Header';

// Not Found page component for charts
export default function ChartsNotFound() {
  return (
    <main className="min-h-screen bg-white">
      {/* Include the Header component at the top of the page */}
      <Header />
      
      {/* Not Found content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center bg-blue-50 rounded-lg p-12 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Charts Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the charts for this trading strategy don&apos;t exist or couldn&apos;t be loaded.
          </p>
          
          {/* Back to strategies link */}
          <Link
            href="/strategies"
            className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Strategies
          </Link>
        </div>
      </div>
    </main>
  );
} 