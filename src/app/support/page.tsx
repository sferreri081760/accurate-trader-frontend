'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I get started with Accurate Trader?",
    answer: "Getting started is easy! Sign up for our 30-day free trial, select the trading strategies that interest you, and you'll have immediate access to performance charts and strategy details. No credit card required for the trial period."
  },
  {
    question: "What makes your strategies different?",
    answer: "Our strategies are built with institutional-quality complexity featuring multi-layer confirmation systems, sophisticated exit protection, and adaptive risk management. Each strategy is thoroughly backtested with complete transparency of performance data."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your subscription at any time with no cancellation fees. If you're in your trial period, cancellation is immediate. For paid subscriptions, you'll retain access until the end of your current billing period."
  },
  {
    question: "How do I view my strategy performance?",
    answer: "Once subscribed, you can access real-time and delayed charts for your selected strategies through the Members section. Each strategy has its own dedicated performance page with interactive charts and detailed analytics."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through Stripe and PayPal payments. All transactions are secure with 256-bit SSL encryption and PCI DSS compliance."
  },
  {
    question: "How often are strategies updated?",
    answer: "Strategy performance data is updated regularly based on live trading results. We continuously monitor and maintain our strategies to ensure optimal performance while maintaining their core institutional-quality architecture."
  },
  {
    question: "Can I customize strategy parameters?",
    answer: "Our strategies are designed as integrated professional systems where parameters are carefully calibrated for optimal performance. We focus on 'System Integrity' rather than customization, ensuring you get institutional-quality results."
  },
  {
    question: "What is the Performance Transparency feature?",
    answer: "Our transparency video shows exactly how performance data flows from TradeStation exports to our interactive charts. This ensures complete authenticity and builds confidence in our reported results."
  }
];

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Message sent successfully! We&apos;ll get back to you within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get help with your account, learn about our strategies, or reach out to our support team. 
            We&apos;re here to help you succeed with algorithmic trading.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/performance/transparency" className="bg-green-50 border border-green-200 rounded-xl p-6 hover:bg-green-100 transition-colors group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎥 Transparency Demo</h3>
            <p className="text-gray-600 text-sm">Watch how our performance data flows from TradeStation to charts</p>
          </Link>

          <Link href="/strategies" className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Strategy Guide</h3>
            <p className="text-gray-600 text-sm">Learn about our 5 institutional-quality trading strategies</p>
          </Link>

          <Link href="/performance" className="bg-purple-50 border border-purple-200 rounded-xl p-6 hover:bg-purple-100 transition-colors group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Performance Data</h3>
            <p className="text-gray-600 text-sm">View complete performance analytics for all strategies</p>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Support</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="account">Account & Subscription</option>
                  <option value="strategies">Strategy Questions</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="performance">Performance Data</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Please describe your question or issue in detail..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Support Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📧 Email Support</h3>
            <p className="text-gray-600 mb-4">
              For detailed questions or account-specific issues, email us directly:
            </p>
            <a href="mailto:support@accuratetrader.com" className="text-green-600 hover:text-green-700 font-medium">
              support@accuratetrader.com
            </a>
            <p className="text-sm text-gray-500 mt-2">
              We typically respond within 24 hours
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">⏰ Support Hours</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Emergency technical issues are monitored 24/7
            </p>
          </div>
        </div>

        {/* Account Management Links */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Account Management
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/subscription" className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200">
              <h3 className="font-semibold text-gray-900">My Subscription</h3>
              <p className="text-sm text-gray-600 mt-1">View billing info, manage strategies, cancel subscription</p>
            </Link>
            <Link href="/subscriber/strategies" className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200">
              <h3 className="font-semibold text-gray-900">My Strategies</h3>
              <p className="text-sm text-gray-600 mt-1">Add or remove strategies from your subscription</p>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

 