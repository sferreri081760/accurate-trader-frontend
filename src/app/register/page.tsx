'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { buildApiUrl } from '@/config/api';

// Initialize Stripe (you'll need to add your publishable key to environment variables)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const STRATEGIES = [
  'Trend',
  'Candlestick',
  'Cup with Handle + Double Bottom',
  'Support-Resistance',
  'MidpointTwo',
];

interface FormData {
  email: string;
  password: string;
  strategies: string[];
  strategyTimestamps: { [strategy: string]: number };
  paymentMethod: 'card' | 'paypal';
  billingInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const PaymentForm = ({ 
  formData, 
  onSubmit, 
  isSubmitting,
  pricing 
}: { 
  formData: FormData;
  onSubmit: (paymentMethod?: unknown, subscriptionId?: string) => Promise<void>;
  isSubmitting: boolean;
  pricing: { monthly: number; description: string };
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'card') {
      // Check if using placeholder keys for UI-only testing
      const isTestMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('your_actual_publishable_key_here');
      
      if (isTestMode) {
        // Skip Stripe processing for UI testing - just create mock payment method
        toast.success('UI Test Mode: Skipping payment processing');
        await onSubmit({ id: 'test_payment_method' });
        return;
      }

      if (!stripe || !elements) {
        toast.error('Stripe not loaded. Please refresh and try again.');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error('Card information not found.');
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.billingInfo.name,
          email: formData.email,
          address: {
            line1: formData.billingInfo.address,
            city: formData.billingInfo.city,
            state: formData.billingInfo.state,
            postal_code: formData.billingInfo.zipCode,
            country: formData.billingInfo.country,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Payment method creation failed');
        return;
      }

      // Create Stripe subscription
      try {
        const response = await fetch(buildApiUrl('/api/stripe/create-subscription'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            pricing: pricing.monthly,
            strategies: formData.strategies,
            email: formData.email,
            paymentMethodId: paymentMethod.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create subscription');
        }

        const { subscriptionId, clientSecret } = await response.json();

        // Confirm the subscription if needed
        if (clientSecret) {
          const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
          if (confirmError) {
            toast.error(`Payment confirmation failed: ${confirmError.message}`);
            return;
          }
        }

        toast.success('Stripe subscription created successfully!');
        await onSubmit(paymentMethod, subscriptionId);
      } catch (error) {
        console.error('Error creating Stripe subscription:', error);
        toast.error('Failed to create subscription. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {formData.paymentMethod === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="bg-white p-3 border border-gray-300 rounded-md">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported: Visa, Mastercard, American Express, and more
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !stripe || formData.strategies.length === 0}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Start 30-Day Free Trial'}
          </button>
        </form>
      )}

      {formData.paymentMethod === 'paypal' && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PP</span>
              </div>
              <h3 className="font-semibold text-blue-900">PayPal Subscription</h3>
            </div>
            <p className="text-sm text-blue-800">
              You&apos;ll be redirected to PayPal to set up your ${pricing.monthly}/month subscription with a 30-day free trial.
            </p>
          </div>

          <PayPalScriptProvider 
            options={{ 
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'your_paypal_client_id_here',
              currency: 'USD',
              intent: 'subscription',
              vault: true
            }}
          >
            <PayPalButtons
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'subscribe'
              }}
              disabled={isSubmitting}
              createSubscription={async () => {
                try {
                  // Create subscription plan on PayPal
                  const response = await fetch(buildApiUrl('/api/paypal/create-subscription'), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      pricing: pricing.monthly,
                      strategies: formData.strategies,
                      email: formData.email
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Failed to create subscription plan');
                  }

                  const { subscriptionId } = await response.json();
                  return subscriptionId;
                } catch (error) {
                  console.error('Error creating subscription:', error);
                  toast.error('Failed to create PayPal subscription');
                  throw error;
                }
              }}
              onApprove={async (data) => {
                try {
                  toast.success('PayPal subscription approved!');
                  await onSubmit(undefined, data.subscriptionID || undefined);
                } catch (error) {
                  console.error('Error processing PayPal subscription:', error);
                  toast.error('Failed to process PayPal subscription');
                }
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
                toast.error('PayPal payment failed. Please try again.');
              }}
              onCancel={() => {
                toast.error('PayPal payment was cancelled');
              }}
            />
          </PayPalScriptProvider>

          <p className="text-xs text-gray-500 text-center">
            By clicking above, you agree to PayPal&apos;s terms and authorize recurring payments
          </p>
        </div>
      )}
    </div>
  );
};

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStrategy = searchParams.get('strategy');
  const hasPreselected = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    strategies: [],
    strategyTimestamps: {},
    paymentMethod: 'card',
    billingInfo: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Pre-select strategy from URL param
  useEffect(() => {
    if (preselectedStrategy && !hasPreselected.current) {
      const normalized = preselectedStrategy.replace(/-/g, '').toLowerCase();
      const matched = STRATEGIES.find(s =>
        s.replace(/[^a-z]/gi, '').toLowerCase() === normalized
      );
      if (matched && !formData.strategies.includes(matched)) {
        setFormData(prev => ({
          ...prev,
          strategies: [...prev.strategies, matched],
          strategyTimestamps: {
            ...prev.strategyTimestamps,
            [matched]: Date.now()
          }
        }));
        hasPreselected.current = true;
      }
    }
  }, [preselectedStrategy, formData.strategies]);

  const handleToggleStrategy = (strategy: string) => {
    const isSelected = formData.strategies.includes(strategy);
    const now = Date.now();
    
    if (isSelected) {
      // Check if within 30-minute window (1800000 ms)
      const selectionTime = formData.strategyTimestamps[strategy];
      const thirtyMinutesAgo = now - (30 * 60 * 1000);
      
      if (selectionTime && selectionTime < thirtyMinutesAgo) {
        toast.error('You can only deselect strategies within 30 minutes of selecting them.');
        return;
      }
      
      // Remove strategy and its timestamp
      const newTimestamps = { ...formData.strategyTimestamps };
      delete newTimestamps[strategy];
      
      setFormData(prev => ({
        ...prev,
        strategies: prev.strategies.filter(s => s !== strategy),
        strategyTimestamps: newTimestamps
      }));
    } else {
      // Add strategy with timestamp
      setFormData(prev => ({
        ...prev,
        strategies: [...prev.strategies, strategy],
        strategyTimestamps: {
          ...prev.strategyTimestamps,
          [strategy]: now
        }
      }));
    }
  };

  const calculatePricing = () => {
    const strategyCount = formData.strategies.length;
    if (strategyCount === 0) return { monthly: 0, description: 'Select strategies to see pricing' };
    if (strategyCount >= 5) return { monthly: 20, description: 'Entire Suite (Best Value!)' };
    return { 
      monthly: strategyCount * 5, 
      description: `${strategyCount} strategy${strategyCount > 1 ? 'ies' : ''} × $5` 
    };
  };

  const getTimeRemaining = (strategy: string) => {
    if (!formData.strategies.includes(strategy)) return null;
    
    const selectionTime = formData.strategyTimestamps[strategy];
    if (!selectionTime) return null;
    
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    const elapsed = now - selectionTime;
    const remaining = thirtyMinutes - elapsed;
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (paymentMethod?: unknown, subscriptionId?: string) => {
    setIsSubmitting(true);

    try {
      const pricing = calculatePricing();
      const subscriptionData = {
        ...formData,
        pricing: pricing.monthly,
        paymentMethodId: typeof paymentMethod === 'object' && paymentMethod && 'id' in paymentMethod ? (paymentMethod as { id: string }).id : undefined,
        paypalSubscriptionId: formData.paymentMethod === 'paypal' ? subscriptionId : null,
        stripeSubscriptionId: formData.paymentMethod === 'card' ? subscriptionId : null,
        trialDays: 30
      };

      const res = await fetch(buildApiUrl('/api/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(subscriptionData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      toast.success('Registration successful! Your 30-day free trial has started.');
      router.push('/subscriber/strategies');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing subscription';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricing = calculatePricing();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Trading Journey
          </h1>
          <p className="text-lg text-gray-600">
            Choose your strategies and start with a <span className="font-semibold text-green-600">30-day free trial</span>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Strategies</h2>
              
              {/* Deselection Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Strategy Selection Window</h3>
                    <p className="text-sm text-blue-800">
                      You can deselect strategies within 30 minutes of selecting them. After this window, 
                      your strategy selection will be locked for this subscription.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Strategy Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRATEGIES.map(strategy => {
                  const isSelected = formData.strategies.includes(strategy);
                  const timeRemaining = getTimeRemaining(strategy);
                  
                  return (
                    <button
                      key={strategy}
                      type="button"
                      onClick={() => handleToggleStrategy(strategy)}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{strategy}</h3>
                          <p className="text-sm text-gray-600">$5/month</p>
                          {isSelected && timeRemaining && (
                            <p className="text-xs text-orange-600 mt-1">
                              Can deselect for: {timeRemaining}
                            </p>
                          )}
                          {isSelected && !timeRemaining && (
                            <p className="text-xs text-gray-500 mt-1">
                              Selection locked
                            </p>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Entire Suite Option */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-green-800">🎯 Entire Suite - Best Value!</h3>
                    <p className="text-green-700">Get all 5 strategies for just $20/month</p>
                    <p className="text-sm text-green-600">Save ${5 * 5 - 20} compared to individual selection</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const now = Date.now();
                      const timestamps: { [strategy: string]: number } = {};
                      STRATEGIES.forEach(strategy => {
                        timestamps[strategy] = now;
                      });
                      setFormData(prev => ({ 
                        ...prev, 
                        strategies: [...STRATEGIES],
                        strategyTimestamps: {
                          ...prev.strategyTimestamps,
                          ...timestamps
                        }
                      }));
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Select All
                  </button>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Cost:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">${pricing.monthly}</span>
                    <p className="text-sm text-gray-600">{pricing.description}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-green-600 font-semibold">✨ First 30 days FREE</p>
                  <p className="text-xs text-gray-500">Cancel anytime during trial period</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={formData.strategies.length === 0}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Account Setup
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Create a secure password"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.billingInfo.name}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={formData.billingInfo.address}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.billingInfo.city}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={formData.billingInfo.state}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    id="zipCode"
                    type="text"
                    required
                    value={formData.billingInfo.zipCode}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    id="country"
                    value={formData.billingInfo.country}
                    onChange={e => setFormData({ 
                      ...formData, 
                      billingInfo: { ...formData.billingInfo, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.email || !formData.password || !formData.billingInfo.name}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Choose Payment Method:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="4" fill="#1A1F36"/>
                        <rect x="2" y="8" width="36" height="2" fill="#FFD700"/>
                        <rect x="2" y="14" width="8" height="1" fill="#FFD700"/>
                      </svg>
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {formData.strategies.map(strategy => (
                    <div key={strategy} className="flex justify-between text-sm">
                      <span className="text-gray-600">{strategy}</span>
                      <span className="text-gray-900">
                        {formData.strategies.length === 5 ? 'Included' : '$5.00'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Monthly Total:</span>
                    <span className="text-green-600">${pricing.monthly}.00</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">30-day free trial • Cancel anytime</p>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  formData={formData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  pricing={pricing}
                />
              </Elements>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">🔒 Secure payment processing by Stripe & PayPal</p>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                  <span>256-bit SSL encryption</span>
                  <span>•</span>
                  <span>PCI DSS compliant</span>
                  <span>•</span>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading registration...</p>
          </div>
        </div>
      </main>
    }>
      <RegisterContent />
    </Suspense>
  );
}
