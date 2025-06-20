// API Configuration
// This handles both development (localhost) and production (deployed) scenarios

const getApiUrl = (): string => {
  // First priority: explicit environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Second priority: runtime environment detection
  if (typeof window !== 'undefined') {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '0.0.0.0';
    
    if (isDevelopment) {
      return 'http://localhost:5000';
    }
  }
  
  // Default: production backend URL
  return 'https://trading-signals-backend-q0ks.onrender.com';
};

export const API_BASE_URL = getApiUrl();

// Debug log to verify which API URL is being used
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

// Helper function to determine if we're in development mode
export const isDevelopmentMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0';
  }
  return process.env.NODE_ENV === 'development';
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function for file URLs (charts, uploads)
export const buildFileUrl = (path: string): string => {
  return `${API_BASE_URL}/uploads/${path}`;
};

// Helper function for API calls with error handling
export const apiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// API availability check
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/api/strategies`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// Helper for upload URLs (images, files)
export const uploadUrl = (path: string): string => {
  return `${API_BASE_URL}/uploads/${path}`;
};

// Helper for performance file URLs
export const perfUrl = (path: string): string => {
  return `${API_BASE_URL}/perf/uploads/${path}`;
};