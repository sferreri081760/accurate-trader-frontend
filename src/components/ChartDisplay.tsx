'use client';

import Image from 'next/image';

export default function ChartDisplay({ src, alt }: { src: string; alt: string }) {
  // Add cache-busting timestamp to force fresh image loads
  const cacheBustedSrc = src.includes('?') ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`;
  
  return (
    <div className="bg-white rounded-lg p-4 h-[400px] relative">
      <Image
        src={cacheBustedSrc}
        alt={alt}
        fill
        className="object-contain"
        unoptimized={true} // Disable Next.js image optimization for dynamic chart images
        priority={false}
        onError={(e) => {
          // Show placeholder if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add('bg-gray-200');
            parent.classList.add('flex');
            parent.classList.add('flex-col');
            parent.classList.add('items-center');
            parent.classList.add('justify-center');
            parent.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p class="text-gray-600 text-center font-medium">Chart Placeholder - Upload via Backend</p>
              <p class="text-gray-500 text-sm text-center mt-2">${alt}</p>
            `;
          }
        }}
      />
    </div>
  );
} 