'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  getCashValueDetails, 
  getPolicy, 
  isPolicyEligibleForSurrender,
  calculateSurrenderValue,
  createSurrenderRequest,
  processSurrenderRequest
} from '@/lib/services/mockDataService';
import { SurrenderType, PaymentMethod } from '@/lib/types';

export default function SurrenderPage() {
  const { id } = useParams();
  const router = useRouter();
  const policyId = Array.isArray(id) ? id[0] : id;
  
  const policy = getPolicy(policyId);
  const cashValue = getCashValueDetails(policyId);
  const eligibility = isPolicyEligibleForSurrender(policyId);

  // Form state
  const [step, setStep] = useState(1);
  const [surrenderType, setSurrenderType] = useState<SurrenderType>('Full');
  const [partialAmount, setPartialAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Check');
  const [bankAccountLast4, setBankAccountLast4] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [error, setError] = useState('');

  // Calculate surrender values
  const calculation = calculateSurrenderValue(
    policyId, 
    surrenderType, 
    surrenderType === 'Partial' ? parseFloat(partialAmount) || 0 : undefined
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (surrenderType === 'Partial') {
        const amount = parseFloat(partialAmount);
        if (!amount || amount <= 0) {
          setError('Please enter a valid partial surrender amount');
          return;
        }
        if (cashValue && amount > cashValue.currentCashValue * 0.9) {
          setError('Partial surrender cannot exceed 90% of cash value');
          return;
        }
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'ACH' && (!bankAccountLast4 || bankAccountLast4.length !== 4)) {
        setError('Please enter the last 4 digits of your bank account');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!reason.trim()) {
        setError('Please provide a reason for surrender');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const request = createSurrenderRequest(
        policyId,
        surrenderType,
        surrenderType === 'Partial' ? parseFloat(partialAmount) : 0,
        reason,
        paymentMethod,
        paymentMethod === 'ACH' ? bankAccountLast4 : undefined
      );

      if (request) {
        // Auto-approve for demo
        const processed = processSurrenderRequest(request.id, true);
        if (processed?.confirmationNumber) {
          setConfirmationNumber(processed.confirmationNumber);
          setStep(5);
        } else {
          setError('Error processing surrender request');
        }
      } else {
        setError('Error creating surrender request');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!policy) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href="/policies" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policies
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-red-500">Policy not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!eligibility.eligible) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href={`/policies/${policyId}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policy
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Not Eligible for Surrender</h3>
              <p className="text-gray-500">{eligibility.reason}</p>
              <Link
                href={`/policies/${policyId}/cash-value`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Cash Value
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href={`/policies/${policyId}/cash-value`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Cash Value
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {['Type', 'Payment', 'Reason', 'Confirm', 'Complete'].map((stepName, index) => (
                <li key={stepName} className={`relative ${index !== 4 ? 'pr-8 sm:pr-20' : ''}`}>
                  <div className="flex items-center">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        step > index + 1
                          ? 'bg-indigo-600'
                          : step === index + 1
                          ? 'border-2 border-indigo-600 bg-white'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {step > index + 1 ? (
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      ) : (
                        <span className={step === index + 1 ? 'text-indigo-600' : 'text-gray-500'}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    {index !== 4 && (
                      <div className={`absolute top-4 w-full h-0.5 ${step > index + 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} style={{ left: '2rem' }} />
                    )}
                  </div>
                  <span className="absolute -bottom-6 w-max text-xs font-medium text-gray-500">{stepName}</span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-12">
          {/* Step 1: Surrender Type */}
          {step === 1 && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Surrender Type</h3>
              
              <div className="space-y-4">
                <div
                  className={`relative rounded-lg border p-4 cursor-pointer ${
                    surrenderType === 'Full' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSurrenderType('Full')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Full Surrender</h4>
                      <p className="text-sm text-gray-500">Surrender the entire policy and receive the full cash value</p>
                    </div>
                    <input
                      type="radio"
                      checked={surrenderType === 'Full'}
                      onChange={() => setSurrenderType('Full')}
                      className="h-4 w-4 text-indigo-600"
                    />
                  </div>
                  {surrenderType === 'Full' && calculation && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">Estimated Net Payout: <span className="font-semibold text-green-600">{formatCurrency(calculation.netAmount)}</span></p>
                    </div>
                  )}
                </div>

                <div
                  className={`relative rounded-lg border p-4 cursor-pointer ${
                    surrenderType === 'Partial' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSurrenderType('Partial')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Partial Surrender</h4>
                      <p className="text-sm text-gray-500">Withdraw a portion of the cash value (up to 90%)</p>
                    </div>
                    <input
                      type="radio"
                      checked={surrenderType === 'Partial'}
                      onChange={() => setSurrenderType('Partial')}
                      className="h-4 w-4 text-indigo-600"
                    />
                  </div>
                  {surrenderType === 'Partial' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      </div>
                      {cashValue && (
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum: {formatCurrency(cashValue.currentCashValue * 0.9)}
                        </p>
                      )}
                      {calculation && parseFloat(partialAmount) > 0 && (
                        <p className="mt-2 text-sm text-gray-700">
                          Estimated Net Payout: <span className="font-semibold text-green-600">{formatCurrency(calculation.netAmount)}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Payment Method</h3>
              
              <div className="space-y-4">
                {(['Check', 'ACH', 'Wire'] as PaymentMethod[]).map((method) => (
                  <div
                    key={method}
                    className={`relative rounded-lg border p-4 cursor-pointer ${
                      paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{method}</h4>
                        <p className="text-sm text-gray-500">
                          {method === 'Check' && 'Mailed to address on file (5-7 business days)'}
                          {method === 'ACH' && 'Direct deposit to your bank account (2-3 business days)'}
                          {method === 'Wire' && 'Wire transfer (1-2 business days, $25 fee applies)'}
                        </p>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="h-4 w-4 text-indigo-600"
                      />
                    </div>
                    {paymentMethod === 'ACH' && method === 'ACH' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 digits of bank account</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={bankAccountLast4}
                          onChange={(e) => setBankAccountLast4(e.target.value.replace(/\D/g, ''))}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                          placeholder="1234"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Reason */}
          {step === 3 && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Reason for Surrender</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Please provide a reason for this surrender request</label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your reason here..."
                />
                <p className="mt-2 text-sm text-gray-500">Common reasons include: financial hardship, no longer need coverage, replacing with different policy, estate planning changes.</p>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Confirm Surrender Request</h3>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {surrenderType === 'Full' 
                        ? 'Warning: A full surrender will terminate this policy permanently.'
                        : 'Note: A partial surrender will reduce your policy\'s cash value and death benefit.'}
                    </p>
                  </div>
                </div>
              </div>

              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.policyNumber}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Surrender Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{surrenderType}</dd>
                </div>
                {calculation && (
                  <>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Gross Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(calculation.grossAmount)}</dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Surrender Charges</dt>
                      <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">-{formatCurrency(calculation.surrenderCharges)}</dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Tax Withholding (10%)</dt>
                      <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">-{formatCurrency(calculation.taxWithholding)}</dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-900 font-bold">Net Payout</dt>
                      <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-bold">{formatCurrency(calculation.netAmount)}</dd>
                    </div>
                  </>
                )}
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {paymentMethod}
                    {paymentMethod === 'ACH' && bankAccountLast4 && ` (****${bankAccountLast4})`}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{reason}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-8">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Surrender Request Processed</h3>
                <p className="text-gray-500 mb-4">Your surrender request has been approved and is being processed.</p>
                <div className="bg-gray-50 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-500">Confirmation Number</p>
                  <p className="text-xl font-bold text-gray-900">{confirmationNumber}</p>
                </div>
                {calculation && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">Net Payout Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculation.netAmount)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Payment via {paymentMethod} • Expected delivery: {
                        paymentMethod === 'Check' ? '5-7 business days' :
                        paymentMethod === 'ACH' ? '2-3 business days' : '1-2 business days'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 pb-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between">
            {step < 5 ? (
              <>
                <button
                  type="button"
                  onClick={step === 1 ? () => router.push(`/policies/${policyId}/cash-value`) : handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    <BanknotesIcon className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Confirm Surrender'}
                  </button>
                )}
              </>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push(`/policies/${policyId}`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Return to Policy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
