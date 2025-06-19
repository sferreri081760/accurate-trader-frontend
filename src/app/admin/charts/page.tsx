'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import { STRATEGIES } from '@/utils/strategy';
import { buildApiUrl } from '@/config/api';

interface FormData {
  strategy: string;
  realTimeChart1: File | null;
  realTimeChart2: File | null;
  delayedChart1: File | null;
  delayedChart2: File | null;
}

interface PerformanceFormData {
  strategy: string;
  performanceFile: File | null;
}

interface Errors {
  strategy?: string;
  realTimeChart1?: string;
  realTimeChart2?: string;
  delayedChart1?: string;
  delayedChart2?: string;
}

interface PerformanceErrors {
  strategy?: string;
  performanceFile?: string;
}

export default function AdminChartUploadPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    strategy: '',
    realTimeChart1: null,
    realTimeChart2: null,
    delayedChart1: null,
    delayedChart2: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Performance upload state
  const [performanceFormData, setPerformanceFormData] = useState<PerformanceFormData>({
    strategy: '',
    performanceFile: null,
  });
  const [performanceErrors, setPerformanceErrors] = useState<PerformanceErrors>({});
  const [isPerformanceLoading, setIsPerformanceLoading] = useState(false);
  const [performanceUploadError, setPerformanceUploadError] = useState('');
  const [performanceUploadSuccess, setPerformanceUploadSuccess] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(buildApiUrl('/api/user'), {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Unauthorized');
        const user = await res.json();
        if (user.role === 'admin' || user.email === 'admin@accuratetrader.com') {
          setAuthorized(true);
        } else {
          toast.error('Access denied');
          router.push('/');
        }
      } catch {
        toast.error('Please log in');
        router.push('/login');
      }
    };
    checkAdmin();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: 'Only PNG and JPG files are allowed' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: 'File size must be less than 5MB' }));
        return;
      }
      if (file.size > 100 * 1024) {
        toast('File is larger than 100KB. Consider compressing it for optimal performance.', {
          icon: '⚠️',
          duration: 4000,
        });
      }
      setFormData(prev => ({ ...prev, [name]: file }));
      if (errors[name as keyof Errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!formData.strategy) {
      newErrors.strategy = 'Please select a strategy';
    } else if (!STRATEGIES.includes(formData.strategy)) {
      newErrors.strategy = 'Invalid strategy selected';
    }

    const atLeastOneFileUploaded =
      formData.realTimeChart1 || formData.realTimeChart2 || formData.delayedChart1 || formData.delayedChart2;
    if (!atLeastOneFileUploaded) {
      newErrors.realTimeChart1 = 'Please upload at least one chart';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!window.confirm(`Are you sure you want to overwrite the charts for "${formData.strategy}"? This action cannot be undone.`))
      return;

    setUploadError('');
    setUploadSuccess(false);
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('strategy', formData.strategy); // Send full strategy name
      if (formData.realTimeChart1) formDataToSend.append('realTimeChart1', formData.realTimeChart1);
      if (formData.realTimeChart2) formDataToSend.append('realTimeChart2', formData.realTimeChart2);
      if (formData.delayedChart1) formDataToSend.append('delayedChart1', formData.delayedChart1);
      if (formData.delayedChart2) formDataToSend.append('delayedChart2', formData.delayedChart2);

      const response = await fetch(buildApiUrl('/api/charts/upload'), {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setUploadSuccess(true);
      setFormData({
        strategy: '',
        realTimeChart1: null,
        realTimeChart2: null,
        delayedChart1: null,
        delayedChart2: null,
      });
      document.querySelectorAll('input[type="file"]').forEach(input => {
        (input as HTMLInputElement).value = '';
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  // Performance upload handlers
  const handlePerformanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPerformanceFormData(prev => ({ ...prev, [name]: value }));
    if (performanceErrors[name as keyof PerformanceErrors]) {
      setPerformanceErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePerformanceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['text/csv', 'text/plain', 'application/csv'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      if (!allowedTypes.includes(file.type) && !['csv', 'txt'].includes(fileExtension || '')) {
        setPerformanceErrors(prev => ({ ...prev, performanceFile: 'Only CSV and TXT files are allowed' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setPerformanceErrors(prev => ({ ...prev, performanceFile: 'File size must be less than 10MB' }));
        return;
      }
      setPerformanceFormData(prev => ({ ...prev, performanceFile: file }));
      if (performanceErrors.performanceFile) {
        setPerformanceErrors(prev => ({ ...prev, performanceFile: undefined }));
      }
    }
  };

  const handlePerformanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: PerformanceErrors = {};

    if (!performanceFormData.strategy) {
      newErrors.strategy = 'Please select a strategy';
    } else if (!STRATEGIES.includes(performanceFormData.strategy)) {
      newErrors.strategy = 'Invalid strategy selected';
    }

    if (!performanceFormData.performanceFile) {
      newErrors.performanceFile = 'Please select a CSV or TXT file';
    }

    if (Object.keys(newErrors).length > 0) {
      setPerformanceErrors(newErrors);
      return;
    }

    if (!window.confirm(`Are you sure you want to upload performance data for "${performanceFormData.strategy}"?`))
      return;

    setPerformanceUploadError('');
    setPerformanceUploadSuccess(false);
    setIsPerformanceLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('strategy', performanceFormData.strategy);
      formDataToSend.append('file', performanceFormData.performanceFile!);

      const response = await fetch(buildApiUrl('/api/performance/upload'), {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setPerformanceUploadSuccess(true);
      setPerformanceFormData({
        strategy: '',
        performanceFile: null,
      });
      // Reset file input
      const fileInput = document.getElementById('performanceFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setPerformanceUploadError(error instanceof Error ? error.message : 'An error occurred during upload');
    } finally {
      setIsPerformanceLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <main className="pt-16 min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Upload Center</h1>
          <p className="mt-2 text-sm text-gray-600">Upload charts and performance data for trading strategies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Upload Section */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">📊 Chart Upload</h2>
              <p className="text-sm text-gray-600">Upload PNG/JPG chart images for strategies</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="strategy" className="block text-sm font-medium text-gray-700">
                  Select Strategy (Charts)
                </label>
                <select
                  id="strategy"
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleChange}
                  className={`block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.strategy ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                >
                  <option value="">Select a strategy</option>
                  {STRATEGIES.map(strategy => (
                    <option key={strategy} value={strategy}>
                      {strategy}
                    </option>
                  ))}
                </select>
                {errors.strategy && <p className="mt-2 text-sm text-red-600">{errors.strategy}</p>}
              </div>

              {['realTimeChart1', 'realTimeChart2', 'delayedChart1', 'delayedChart2'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {formData.strategy === 'Portfolio Buys' ? (
                      field === 'realTimeChart1' ? 'Same-Day 1' :
                      field === 'realTimeChart2' ? 'Same-Day 2' :
                      field === 'delayedChart1' ? 'Same-Day 3' :
                      'Same-Day 4'
                    ) : (
                      <>
                        {field.includes('realTime') ? 'Real-time' : 'Delayed'} Chart{' '}
                        {field.endsWith('1') ? '1 (Entry/Exit)' : '2 (Performance)'}
                      </>
                    )}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                      errors[field as keyof Errors] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors[field as keyof Errors] && (
                    <p className="mt-2 text-sm text-red-600">{errors[field as keyof Errors]}</p>
                  )}
                </div>
              ))}

              {uploadError && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{uploadError}</p>
                </div>
              )}

              {uploadSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">Charts uploaded successfully!</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Uploading...' : 'Upload Charts'}
                </button>
              </div>
            </form>
          </div>

          {/* Performance Upload Section */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">📈 Performance Data Upload</h2>
              <p className="text-sm text-gray-600">Upload CSV/TXT performance data files</p>
              <div className="mt-3 flex gap-4">
                <a 
                  href={`${buildApiUrl('/perf/uploads/performance_template.csv')}`} 
                  download="performance_template.csv"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  📄 Download CSV Template
                </a>
                <a 
                  href={`${buildApiUrl('/perf/uploads/performance_template.txt')}`} 
                  download="performance_template.txt"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  📄 Download TXT Template
                </a>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handlePerformanceSubmit}>
              <div>
                <label htmlFor="performanceStrategy" className="block text-sm font-medium text-gray-700">
                  Select Strategy (Performance)
                </label>
                <select
                  id="performanceStrategy"
                  name="strategy"
                  value={performanceFormData.strategy}
                  onChange={handlePerformanceChange}
                  className={`block w-full pl-3 pr-10 py-2 text-base border ${
                    performanceErrors.strategy ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md`}
                >
                  <option value="">Select a strategy</option>
                  {STRATEGIES.map(strategy => (
                    <option key={strategy} value={strategy}>
                      {strategy}
                    </option>
                  ))}
                </select>
                {performanceErrors.strategy && <p className="mt-2 text-sm text-red-600">{performanceErrors.strategy}</p>}
              </div>

              <div>
                <label htmlFor="performanceFile" className="block text-sm font-medium text-gray-700">
                  Performance Data File (CSV/TXT)
                </label>
                <div className="mt-1">
                  <input
                    id="performanceFile"
                    name="performanceFile"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handlePerformanceFileChange}
                    disabled={isPerformanceLoading}
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 ${
                      performanceErrors.performanceFile ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Required columns: date, symbol, trade_type, profit_loss<br/>
                    <span className="text-green-600">✓ Supports variations:</span> Date/Timestamp → date, Ticker/Stock → symbol, Type/Side/Action → trade_type, P&L/PnL/Return → profit_loss
                  </p>
                </div>
                {performanceErrors.performanceFile && (
                  <p className="mt-2 text-sm text-red-600">{performanceErrors.performanceFile}</p>
                )}
              </div>

              {performanceUploadError && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{performanceUploadError}</p>
                </div>
              )}

              {performanceUploadSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">Performance data uploaded successfully!</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isPerformanceLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPerformanceLoading ? 'Uploading...' : 'Upload Performance Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}