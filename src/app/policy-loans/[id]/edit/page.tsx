'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetchPolicyLoan, updatePolicyLoan } from '@/lib/services/apiClient';
import { PolicyLoan, PolicyLoanStatus } from '@/lib/types';

export default function EditPolicyLoanPage() {
  const router = useRouter();
  const { id } = useParams();
  const loanId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PolicyLoan>>({});

  useEffect(() => {
    if (!loanId) return;
    fetchPolicyLoan(loanId)
      .then(loan => {
        if (loan) {
          setFormData(loan);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading policy loan:', error);
        setNotFound(true);
        setLoading(false);
      });
  }, [loanId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['requestedAmount', 'approvedAmount', 'cashValueReviewed', 'annualInterestRate'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanId) return;

    setIsSaving(true);
    try {
      await updatePolicyLoan(loanId, formData);
      router.push(`/policy-loans/${loanId}`);
    } catch (error) {
      console.error('Error updating policy loan:', error);
      setIsSaving(false);
    }
  };

  if (loading) {
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

  if (notFound) {
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
          <Link href={`/policy-loans/${loanId}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Loan
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Loan {formData.approvalNumber}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="approvalNumber" className="block text-sm font-medium text-gray-700">Approval number</label>
                  <input
                    type="text" name="approvalNumber" id="approvalNumber" required
                    value={formData.approvalNumber || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status" name="status" required
                    value={formData.status || 'Pending'} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {(['Pending', 'Approved', 'Partially Approved', 'Rejected', 'Disbursed'] as PolicyLoanStatus[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700">Request date</label>
                  <input
                    type="date" name="requestDate" id="requestDate" required
                    value={formData.requestDate || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">Effective date</label>
                  <input
                    type="date" name="effectiveDate" id="effectiveDate" required
                    value={formData.effectiveDate || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">Requested amount</label>
                  <input
                    type="number" step="0.01" name="requestedAmount" id="requestedAmount" required
                    value={formData.requestedAmount ?? 0} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700">Approved amount</label>
                  <input
                    type="number" step="0.01" name="approvedAmount" id="approvedAmount" required
                    value={formData.approvedAmount ?? 0} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cashValueReviewed" className="block text-sm font-medium text-gray-700">Cash value reviewed</label>
                  <input
                    type="number" step="0.01" name="cashValueReviewed" id="cashValueReviewed" required
                    value={formData.cashValueReviewed ?? 0} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="annualInterestRate" className="block text-sm font-medium text-gray-700">Annual interest rate (%)</label>
                  <input
                    type="number" step="0.01" name="annualInterestRate" id="annualInterestRate" required
                    value={formData.annualInterestRate ?? 0} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="interestMethod" className="block text-sm font-medium text-gray-700">Interest method</label>
                  <input
                    type="text" name="interestMethod" id="interestMethod" required
                    value={formData.interestMethod || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="repaymentTerms" className="block text-sm font-medium text-gray-700">Repayment terms</label>
                  <input
                    type="text" name="repaymentTerms" id="repaymentTerms" required
                    value={formData.repaymentTerms || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="disbursementMethod" className="block text-sm font-medium text-gray-700">Disbursement method</label>
                  <input
                    type="text" name="disbursementMethod" id="disbursementMethod" required
                    value={formData.disbursementMethod || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="disbursementTiming" className="block text-sm font-medium text-gray-700">Disbursement timing</label>
                  <input
                    type="text" name="disbursementTiming" id="disbursementTiming" required
                    value={formData.disbursementTiming || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="nextStepMessage" className="block text-sm font-medium text-gray-700">Next-step message</label>
                  <input
                    type="text" name="nextStepMessage" id="nextStepMessage"
                    value={formData.nextStepMessage || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal notes</label>
                  <textarea
                    name="notes" id="notes" rows={3}
                    value={formData.notes || ''} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
