'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  getCashValueDetails, 
  getPolicy, 
  isPolicyEligibleForSurrender 
} from '@/lib/services/mockDataService';

export default function CashValuePage() {
  const { id } = useParams();
  const router = useRouter();
  const policyId = Array.isArray(id) ? id[0] : id;
  
  const policy = getPolicy(policyId);
  const cashValue = getCashValueDetails(policyId);
  const eligibility = isPolicyEligibleForSurrender(policyId);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!cashValue) {
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cash Value Available</h3>
              <p className="text-gray-500">This policy does not have cash value. Cash value is only available for certain policy types like Whole Life, Universal Life, and Annuities.</p>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href={`/policies/${policyId}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policy
            </Link>
          </div>
          {eligibility.eligible && (
            <button
              onClick={() => router.push(`/policies/${policyId}/surrender`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <BanknotesIcon className="h-4 w-4 mr-2" />
              Surrender Policy
            </button>
          )}
        </div>

        {/* Policy Info Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cash Value Summary
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Policy {policy.policyNumber} • {policy.policyType}
            </p>
          </div>
        </div>

        {/* Cash Value Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Current Cash Value</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(cashValue.currentCashValue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Net Surrender Value</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(cashValue.netSurrenderValue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Loan Balance</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(cashValue.loanBalance)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Accumulated Dividends</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(cashValue.accumulatedDividends)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Cash Value Breakdown */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cash Value Breakdown</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed breakdown of your policy&apos;s cash value components.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Guaranteed Cash Value</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(cashValue.guaranteedCashValue)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Non-Guaranteed Cash Value</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(cashValue.nonGuaranteedCashValue)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Paid-Up Additions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(cashValue.paidUpAdditions)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Accumulated Dividends</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(cashValue.accumulatedDividends)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 font-bold">Total Current Cash Value</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">{formatCurrency(cashValue.currentCashValue)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Surrender Value Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Surrender Value Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">What you would receive if you surrender this policy.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Gross Surrender Value</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(cashValue.surrenderValue)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Surrender Charges</dt>
                <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">-{formatCurrency(cashValue.surrenderCharges)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Outstanding Loan Balance</dt>
                <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">-{formatCurrency(cashValue.loanBalance)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900 font-bold">Net Surrender Value</dt>
                <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-bold">{formatCurrency(cashValue.netSurrenderValue)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Eligibility Status */}
        <div className={`bg-white shadow overflow-hidden sm:rounded-lg mb-6 border-l-4 ${eligibility.eligible ? 'border-green-500' : 'border-yellow-500'}`}>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              {eligibility.eligible ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-3" />
              )}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {eligibility.eligible ? 'Eligible for Surrender' : 'Not Eligible for Surrender'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {eligibility.eligible 
                    ? 'This policy can be surrendered. Click the button above to start the surrender process.'
                    : eligibility.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-gray-500 text-right">
          Last calculated: {formatDate(cashValue.lastCalculatedDate)}
        </div>
      </div>
    </DashboardLayout>
  );
}
