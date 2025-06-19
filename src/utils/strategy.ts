export const STRATEGY_MAP: { [key: string]: string } = {
  'candlestick': 'cs',
  'cup with handle + double bottom': 'cwh',
  'cup-with-handle-double-bottom': 'cwh',
  'trend': 'trend',
  'support-resistance': 'sr',
  'midpointtwo': 'mid',
  'market conditions': 'mc',
  'portfolio buys': 'pb'
};
  
export const STRATEGIES = [
  'Candlestick',
  'Cup with Handle + Double Bottom',
  'Trend',
  'Support-Resistance',
  'MidpointTwo',
  'Market Conditions',
  'Portfolio Buys'
];
  
export const getStrategyAbbreviation = (strategyName: string): string => {
  const normalized = strategyName.toLowerCase().replace(/\+/g, ' ').replace(/\s+/g, '-');
  for (const [fullName, abbrev] of Object.entries(STRATEGY_MAP)) {
    const normalizedMapKey = fullName.toLowerCase().replace(/\+/g, ' ').replace(/\s+/g, '-');
    if (normalizedMapKey === normalized) {
      return abbrev;
    }
  }
  return normalized;
};