'use client';

// Import React hooks
import { useState } from 'react';

// Define TypeScript interface for component props
interface ParametersSectionProps {
  title: string;
  parameters: { name: string; description: string }[];
}

// Client component for collapsible parameters section
export default function ParametersSection({ title, parameters }: ParametersSectionProps) {
  // State to track if the section is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Clickable header section */}
      <button
        onClick={toggleExpanded}
        className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
      >
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        {/* Arrow icon that rotates based on expanded state */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Collapsible content section */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-blue-50">
          <ul className="space-y-3">
            {parameters.map((param, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium text-gray-900">{param.name}</span>
                  {param.description && (
                    <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 