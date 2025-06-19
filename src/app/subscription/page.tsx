'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import { buildApiUrl } from '@/config/api';

interface SubscriptionData {
  status: string;
  payment_method: string;
  monthly_price: number;
  trial_start?: string;
  trial_end?: string;
  next_billing_date?: string;
  billing_info: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  strategies: string[];
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(buildApiUrl('/api/subscription'), {
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch subscription');
        }

        const data = await res.json();
        setSubscription(data);
      } catch (err) {
        toast.error('Failed to load subscription information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Listen for focus events to refresh data when user returns to page
    const handleFocus = () => {
      fetchSubscription();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'trial':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Free Trial</span>;
      case 'active':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>;
      case 'payment_required':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Payment Required</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">{status}</span>;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    
    try {
      const res = await fetch(buildApiUrl('/api/subscription/cancel'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      const data = await res.json();
      toast.success(data.message);
      
      // Refresh subscription data
              const refreshRes = await fetch(buildApiUrl('/api/subscription'), {
        credentials: 'include',
      });
      
      if (refreshRes.ok) {
        const refreshedData = await refreshRes.json();
        setSubscription(refreshedData);
      }
      
      setShowCancelModal(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Subscription Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn&apos;t find your subscription information.</p>
            <button
              onClick={() => router.push('/register')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isTrialActive = subscription.status === 'trial' && subscription.trial_end;
  const daysRemaining = isTrialActive ? getDaysRemaining(subscription.trial_end!) : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your trading strategies subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subscription Status</h2>
                {getStatusBadge(subscription.status)}
              </div>

              {isTrialActive && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold text-blue-900">Free Trial Active</h3>
                  </div>
                  <p className="text-blue-800">
                    You have <span className="font-bold">{daysRemaining} days</span> remaining in your free trial.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Trial ends on {formatDate(subscription.trial_end!)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
                  <p className="text-2xl font-bold text-gray-900">${subscription.monthly_price}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <p className="text-lg text-gray-900 capitalize">{subscription.payment_method}</p>
                  {subscription.payment_method === 'card' && (
                    <p className="text-sm text-gray-500">Credit/Debit Card</p>
                  )}
                </div>

                {subscription.next_billing_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                    <p className="text-lg text-gray-900">{formatDate(subscription.next_billing_date)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{subscription.billing_info.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{subscription.billing_info.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <p className="text-gray-900">{subscription.billing_info.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <p className="text-gray-900">{subscription.billing_info.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <p className="text-gray-900">{subscription.billing_info.zipCode || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <p className="text-gray-900">{subscription.billing_info.country || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategies Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Strategies</h2>
              <div className="space-y-3">
                {subscription.strategies.map((strategy, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-900">{strategy}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {subscription.strategies.length} of 5 strategies selected
                </p>
                <button
                  onClick={() => router.push('/subscriber/strategies')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Add More Strategies
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-900 mb-2">Need Help?</h3>
              <p className="text-sm text-green-800 mb-4">
                Contact our support team for assistance with your subscription.
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {subscription.status === 'payment_required' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-yellow-900">Trial Expired - Payment Required</h3>
            </div>
            <p className="text-yellow-800 mb-4">
              Your free trial has ended. Please update your payment information to continue accessing your strategies.
            </p>
            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Update Payment Method
            </button>
          </div>
        )}

        {/* Cancel Subscription Button */}
        {subscription.status !== 'cancelled' && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-6 py-2 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? 
                {subscription.status === 'trial' 
                  ? ' Your free trial will end immediately.' 
                  : ' You will continue to have access until the end of your current billing period.'
                }
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={cancelling}
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 