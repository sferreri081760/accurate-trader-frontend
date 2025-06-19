// Chart utility for loading real uploaded charts from backend
import { API_BASE_URL } from '@/config/api';
import { getStrategyAbbreviation } from '@/utils/strategy';

interface ChartOptions {
  strategy: string;
  type: 'real-time' | 'delayed';
  chartNumber?: number;
  cacheKey?: string;
}

export const getChartUrl = (options: ChartOptions): string => {
  const { strategy, type, chartNumber = 1, cacheKey } = options;
  
  // Use the strategy abbreviation system to construct file names
  const strategyAbbrev = getStrategyAbbreviation(strategy);
  const suffix = chartNumber > 1 ? `-${chartNumber}` : '';
  const filename = `${strategyAbbrev}-${type}${suffix}.png`;
  
  // Construct the full URL to the backend uploads endpoint
  const chartUrl = `${API_BASE_URL}/uploads/${filename}${cacheKey ? `?v=${cacheKey}` : ''}`;
  
  return chartUrl;
};

// Check if a chart exists by making a HEAD request
export const checkChartExists = async (chartUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(chartUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Chart availability check failed:', error);
    return false;
  }
}; 