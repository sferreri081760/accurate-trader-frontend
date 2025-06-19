// Import the Link component from Next.js for client-side navigation (faster page loads)
import Link from 'next/link';
import Navigation from './Navigation';

// Define the Header component that will be used at the top of every page
const Header = () => {
  return (
    // The header element with a white background and subtle shadow
    <header className="bg-white shadow-sm">
      {/* Navigation bar with maximum width and responsive padding */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and site name on the left side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Accurate Trader</span>
            </Link>
          </div>

          {/* Navigation component for client-side functionality */}
          <Navigation />
        </div>
      </nav>
    </header>
  );
};

export default Header; 