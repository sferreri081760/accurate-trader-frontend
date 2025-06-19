import { useState, useCallback } from 'react';

export function useImageCache() {
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());

  const refreshCache = useCallback(() => {
    setCacheKey(Date.now().toString());
  }, []);

  const addCacheBusterToUrl = useCallback((url: string): string => {
    if (!url) return url;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${cacheKey}&t=${Date.now()}`;
  }, [cacheKey]);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = addCacheBusterToUrl(url);
    });
  }, [addCacheBusterToUrl]);

  return {
    cacheKey,
    refreshCache,
    addCacheBusterToUrl,
    preloadImage
  };
} 