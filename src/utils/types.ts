export interface Chart {
    chart1: string | null;
    chart2: string | null;
  }

export interface StrategyMetrics {
  profitFactor: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
}

export interface StrategyParameter {
  name: string;
  description: string;
}

export interface Strategy {
  name: string;
  description: string;
  pageTitle: string;
  introduction: string;
  howItWorks: string;
  riskManagement: string;
  parameters: StrategyParameter[];
  metrics: StrategyMetrics;
  notes: string;
}

export interface BillingInfo {
  fullName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

export interface SubscriptionData {
  payment_method: 'card' | 'paypal';
  billing_info: BillingInfo;
  monthly_price: number;
  payment_method_id?: string;
  paypal_subscription_id?: string;
  trial_start: string;
  trial_end: string;
  trial_days: number;
  status: 'trial' | 'active' | 'cancelled' | 'past_due' | 'payment_required';
  next_billing_date: string;
}

export interface User {
  email: string;
  strategies: string[];
  created_at: string;
  subscription: SubscriptionData;
}

export interface PerformanceDataPoint {
  date: string;
  dollar_value: number;
  percent_gain: number;
}

export interface PerformanceData {
  [strategy: string]: PerformanceDataPoint[];
}

export interface PayPalSubscriptionResponse {
  subscriptionId: string;
  planId: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  strategies: string[];
  paymentMethod: 'card' | 'paypal';
  billingInfo: BillingInfo;
  pricing: number;
  paymentMethodId?: string;
  paypalSubscriptionId?: string;
  trialDays?: number;
}