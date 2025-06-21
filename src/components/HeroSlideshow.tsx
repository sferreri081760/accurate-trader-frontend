'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TextSlide {
  type: 'text';
  title: string;
  subtitle: string;
  background: string;
}

interface ImageSlide {
  type: 'image';
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  textPosition?: 'center' | 'top' | 'bottom';
}

type SlideData = TextSlide | ImageSlide;

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slide data - First slide is text-based, then the uploaded images
  const slides: SlideData[] = [
    {
      type: 'text',
      title: 'Unlock the Power of Standardized Trading',
      subtitle: 'Professional algorithmic trading strategies with proven results',
      background: 'bg-gradient-to-br from-blue-900 via-purple-900 to-green-900'
    },
    {
      type: 'image',
      src: '/images/3_Real-World-Trading-Success.png',
      alt: 'Real World Trading Success',
      title: 'Real-World Trading Success',
      subtitle: '',
      textPosition: 'top'
    },
    {
      type: 'image',
      src: '/images/SPY 0526P.png',
      alt: 'SPY Trading Analysis',
      title: 'Professional Market Analysis',
      subtitle: 'Advanced technical analysis for better decisions',
      textPosition: 'center'
    },
    {
      type: 'image',
      src: '/images/CCEP CWH dblbot for Gamma P.png',
      alt: 'Cup with Handle Double Bottom Strategy',
      title: 'Cup with Handle + Double Bottom',
      subtitle: 'Reversal patterns with high probability setups',
      textPosition: 'bottom'
    },
    {
      type: 'image',
      src: '/images/AMT CWH for Gamma .png',
      alt: 'AMT Cup with Handle Analysis',
      title: 'Pattern Recognition Excellence',
      subtitle: 'Automated pattern detection and validation',
      textPosition: 'bottom'
    },
    {
      type: 'image',
      src: '/images/SMCI M TOP0129P.png',
      alt: 'SMCI Market Top Analysis',
      title: 'Market Timing Precision',
      subtitle: 'Identify optimal entry and exit points',
      textPosition: 'center'
    },
    {
      type: 'image',
      src: '/images/SMCI W2 0124P.png',
      alt: 'SMCI Weekly Analysis',
      title: 'Multi-Timeframe Analysis',
      subtitle: 'Comprehensive market perspective',
      textPosition: 'bottom'
    },
    {
      type: 'image',
      src: '/images/PSTG TH 907 Multiple signals.jpg',
      alt: 'Multiple Trading Signals',
      title: 'Multiple Signal Confirmation',
      subtitle: 'Enhanced accuracy through signal convergence',
      textPosition: 'bottom'
    }
  ];

  // Auto-advance slides every 10 seconds (when not paused)
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [slides.length, isPaused]);

  // Helper function to get text positioning classes
  const getTextPositionClasses = (position: 'center' | 'top' | 'bottom' = 'center') => {
    switch (position) {
      case 'top':
        return 'absolute top-22 left-0 right-0 flex justify-center px-6';
      case 'bottom':
        return 'absolute bottom-42 left-0 right-0 flex justify-center px-6';
      default:
        return 'absolute inset-0 flex items-center justify-center';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.type === 'text' ? (
            // Text-based first slide
            <div className={`w-full h-full flex items-center justify-center ${slide.background}`}>
              <div className="text-center px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium drop-shadow-lg">
                  {slide.subtitle}
                </p>
              </div>
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
            </div>
          ) : (
            // Image-based slides
            <div className="relative w-full h-full overflow-hidden" style={{ clipPath: 'inset(0 0 113px 0)' }}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                style={{ objectPosition: 'center center' }}
                priority={index <= 2}
                sizes="100vw"
              />
              {/* Lighter overlay for repositioned text slides to maintain chart visibility */}
              <div className={`absolute inset-0 ${
                slide.textPosition === 'bottom' || slide.textPosition === 'top' ? 'bg-black/25' : 'bg-black/40'
              }`}></div>
              
              {/* Slide content overlay with dynamic positioning */}
              <div className={
                slide.src === '/images/CCEP CWH dblbot for Gamma P.png'
                  ? 'absolute bottom-[460px] left-[116px] flex justify-start px-6'
                  : slide.src === '/images/SPY 0526P.png'
                  ? 'absolute top-[122px] right-40 flex justify-end'
                  : slide.src === '/images/SMCI W2 0124P.png'
                  ? 'absolute top-[108px] left-8 flex justify-start'
                  : slide.src === '/images/AMT CWH for Gamma .png'
                  ? 'absolute bottom-[207px] left-0 right-0 flex justify-center px-6'
                  : slide.src === '/images/PSTG TH 907 Multiple signals.jpg'
                  ? 'absolute bottom-[451px] left-0 right-0 flex justify-center px-6'
                  : slide.src === '/images/3_Real-World-Trading-Success.png'
                  ? 'absolute top-[69px] left-0 right-0 flex justify-center px-6'
                  : getTextPositionClasses(slide.textPosition)
              }>
                <div className="text-center max-w-4xl">
                  <h2 className={`font-bold mb-4 drop-shadow-2xl ${
                    slide.src === '/images/3_Real-World-Trading-Success.png' 
                      ? 'text-black' 
                      : 'text-white'
                  } ${
                    slide.textPosition === 'bottom' || slide.textPosition === 'top'
                      ? 'text-2xl md:text-4xl lg:text-5xl' 
                      : 'text-3xl md:text-5xl lg:text-6xl'
                  }`}>
                    {slide.title}
                  </h2>
                  <p className={`font-medium drop-shadow-lg ${
                    slide.src === '/images/3_Real-World-Trading-Success.png' 
                      ? 'text-black/90' 
                      : 'text-white/90'
                  } ${
                    slide.textPosition === 'bottom' || slide.textPosition === 'top'
                      ? 'text-base md:text-lg lg:text-xl'
                      : 'text-lg md:text-xl lg:text-2xl'
                  }`}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Slide indicators and pause/play control */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Pause/Play button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10v4m6-4v4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroSlideshow; 