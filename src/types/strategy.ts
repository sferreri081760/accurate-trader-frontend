// Strategy type definitions for Accurate Trader

export interface Strategy {
  name: string;
  description: string;
  price: number;
  monthlyPrice: number;
  performance: string;
  pageTitle?: string;
  introduction?: string;
  howItWorks?: string;
  riskManagement?: string;
  parameters?: Array<{
    name: string;
    value: string;
    description: string;
  }>;
  metrics?: {
    profitFactor: number;
    winRate: number;
    totalReturn: number;
    maxDrawdown: number;
  };
  notes?: string;
} 