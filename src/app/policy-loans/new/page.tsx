'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fetchPolicies, createPolicyLoan } from '@/lib/services/apiClient';
import { Policy, PolicyLoan, PolicyLoanStatus } from '@/lib/types';

function NewPolicyLoanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPolicyId = searchParams.get('policyId') || '';

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    policyId: preselectedPolicyId,
    approvalNumber: '',
    status: 'Pending' as PolicyLoanStatus,
    requestDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    requestedAmount: 0,
    approvedAmount: 0,
    cashValueReviewed: 0,
    annualInterestRate: 5.25,
    interestMethod: 'Fixed; simple interest projection',
    repaymentTerms: 'Flexible; payable at any time',
    disbursementMethod: '',
    disbursementTiming: 'within 2–3 business days',
    nextStepMessage: 'No additional action is required unless we contact you.',
    notes: '',
  });

  useEffect(() => {
    fetchPolicies()
      .then(loadedPolicies => {
        setPolicies(loadedPolicies);
        // Pre-fill cash value once we know which policy the URL preselected.
        const policy = loadedPolicies.find(p => p.id === preselectedPolicyId);
        if (policy?.cashValue !== undefined) {
          setFormData(prev => ({ ...prev, cashValueReviewed: policy.cashValue as number }));
        }
      })
      .catch(error => console.error('Error loading policies:', error));
  }, [preselectedPolicyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['requestedAmount', 'approvedAmount', 'cashValueReviewed', 'annualInterestRate'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const policyId = e.target.value;
    const policy = policies.find(p => p.id === policyId);
    setFormData(prev => ({
      ...prev,
      policyId,
      cashValueReviewed: policy?.cashValue !== undefined ? policy.cashValue : prev.cashValueReviewed,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const policy = policies.find(p => p.id === formData.policyId);
    if (!policy) return;

    setIsSaving(true);
    const payload: Omit<PolicyLoan, 'id'> = {
      ...formData,
      policyNumber: policy.policyNumber,
    };

    try {
      const created = await createPolicyLoan(payload);
      router.push(`/policy-loans/${created.id}`);
    } catch (error) {
      console.error('Error creating policy loan:', error);
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">New Policy Loan Request</h1>
          <Link
            href="/policies"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="policyId" className="block text-sm font-medium text-gray-700">Policy*</label>
                  <select
                    id="policyId"
                    name="policyId"
                    required
                    value={formData.policyId}
                    onChange={handlePolicyChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a policy</option>
                    {policies.map(policy => (
                      <option key={policy.id} value={policy.id}>
                        {policy.policyNumber} - {policy.policyType} ({policy.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="approvalNumber" className="block text-sm font-medium text-gray-700">Approval number*</label>
                  <input
                    type="text" name="approvalNumber" id="approvalNumber" required
                    value={formData.approvalNumber} onChange={handleChange}
                    placeholder="PLA-2026-000000"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
                  <select
                    id="status" name="status" required
                    value={formData.status} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Partially Approved">Partially Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Disbursed">Disbursed</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700">Request date*</label>
                  <input
                    type="date" name="requestDate" id="requestDate" required
                    value={formData.requestDate} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">Effective date*</label>
                  <input
                    type="date" name="effectiveDate" id="effectiveDate" required
                    value={formData.effectiveDate} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">Requested amount*</label>
                  <input
                    type="number" step="0.01" name="requestedAmount" id="requestedAmount" required
                    value={formData.requestedAmount} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700">Approved amount*</label>
                  <input
                    type="number" step="0.01" name="approvedAmount" id="approvedAmount" required
                    value={formData.approvedAmount} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cashValueReviewed" className="block text-sm font-medium text-gray-700">Cash value reviewed*</label>
                  <input
                    type="number" step="0.01" name="cashValueReviewed" id="cashValueReviewed" required
                    value={formData.cashValueReviewed} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="annualInterestRate" className="block text-sm font-medium text-gray-700">Annual interest rate (%)*</label>
                  <input
                    type="number" step="0.01" name="annualInterestRate" id="annualInterestRate" required
                    value={formData.annualInterestRate} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="interestMethod" className="block text-sm font-medium text-gray-700">Interest method*</label>
                  <input
                    type="text" name="interestMethod" id="interestMethod" required
                    value={formData.interestMethod} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="repaymentTerms" className="block text-sm font-medium text-gray-700">Repayment terms*</label>
                  <input
                    type="text" name="repaymentTerms" id="repaymentTerms" required
                    value={formData.repaymentTerms} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="disbursementMethod" className="block text-sm font-medium text-gray-700">Disbursement method*</label>
                  <input
                    type="text" name="disbursementMethod" id="disbursementMethod" required
                    placeholder="ACH to account ending in 4821"
                    value={formData.disbursementMethod} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="disbursementTiming" className="block text-sm font-medium text-gray-700">Disbursement timing*</label>
                  <input
                    type="text" name="disbursementTiming" id="disbursementTiming" required
                    value={formData.disbursementTiming} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="nextStepMessage" className="block text-sm font-medium text-gray-700">Next-step message</label>
                  <input
                    type="text" name="nextStepMessage" id="nextStepMessage"
                    value={formData.nextStepMessage} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal notes</label>
                  <textarea
                    name="notes" id="notes" rows={3}
                    value={formData.notes} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSaving || !formData.policyId}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Creating...' : 'Create Loan Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function NewPolicyLoanPage() {
  return (
    <Suspense fallback={null}>
      <NewPolicyLoanForm />
    </Suspense>
  );
}
