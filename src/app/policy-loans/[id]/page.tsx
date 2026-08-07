'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetchPolicyLoan, fetchPolicyLoanLetterData, PolicyLoanLetterData } from '@/lib/services/apiClient';
import { PolicyLoan } from '@/lib/types';

export default function PolicyLoanDetail() {
  const { id } = useParams();
  const loanId = Array.isArray(id) ? id[0] : id;

  const [loan, setLoan] = useState<PolicyLoan | null | undefined>(undefined);
  const [letterData, setLetterData] = useState<PolicyLoanLetterData | null>(null);
  const [letterDataError, setLetterDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!loanId) return;

    const loadData = async () => {
      try {
        const loanData = await fetchPolicyLoan(loanId);
        setLoan(loanData);

        if (loanData) {
          try {
            const letter = await fetchPolicyLoanLetterData(loanData.policyId);
            setLetterData(letter);
          } catch {
            setLetterDataError('Could not build letter payload for this policy.');
          }
        }
      } catch (error) {
        console.error('Error loading policy loan:', error);
        setLoan(null);
      }
    };

    loadData();
  }, [loanId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loan === undefined) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!loan) {
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
            <p className="text-red-500">Policy loan not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href={`/policies/${loan.policyId}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policy
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Loan Approval {loan.approvalNumber}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">
                Policy {loan.policyNumber}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                loan.status === 'Partially Approved' ? 'bg-yellow-100 text-yellow-800' :
                loan.status === 'Disbursed' ? 'bg-blue-100 text-blue-800' :
                loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {loan.status}
              </span>
              <Link
                href={`/policy-loans/${loan.id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Loan details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Approval Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">These are the fields the loan-approval letter is generated from.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Request date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(loan.requestDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Effective date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(loan.effectiveDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Requested amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(loan.requestedAmount)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Approved amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(loan.approvedAmount)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Cash value reviewed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(loan.cashValueReviewed)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Annual interest rate</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loan.annualInterestRate.toFixed(2)}% ({loan.interestMethod})</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Repayment</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loan.repaymentTerms}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Disbursement</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loan.disbursementMethod} ({loan.disbursementTiming})</dd>
              </div>
              {loan.nextStepMessage && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Next steps</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loan.nextStepMessage}</dd>
                </div>
              )}
              {loan.notes && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loan.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Letter payload preview */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Letter Payload (PulseGene)</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">
                What <code className="bg-gray-100 px-1 rounded">GET /api/policies/{loan.policyId}/loan-letter-data</code> returns.
                Feed this into your CalcGene step for <code className="bg-gray-100 px-1 rounded">loanCalculation</code>, then
                pass both into the DocuGene &quot;Policy Loan Approval&quot; template.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {letterDataError && <p className="text-sm text-red-600">{letterDataError}</p>}
            {letterData && (
              <pre className="bg-gray-900 text-green-300 text-xs rounded-md p-4 overflow-x-auto">
                {JSON.stringify(letterData, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">History</h3>
          </div>
          <div className="border-t border-gray-200">
            {loan.auditTrail && loan.auditTrail.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {loan.auditTrail.map((entry) => (
                  <li key={entry.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.action === 'create' && 'Loan Created'}
                            {entry.action === 'update' && 'Loan Updated'}
                            {entry.action === 'delete' && 'Loan Deleted'}
                          </div>
                          <div className="text-sm text-gray-700">{new Date(entry.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="mt-1 text-sm text-gray-700 flex items-center">
                          <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {entry.userName}
                        </div>
                        {entry.notes && <div className="mt-2 text-sm text-gray-700"><p>{entry.notes}</p></div>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No history available for this loan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
