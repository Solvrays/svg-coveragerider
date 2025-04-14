'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policies, policyHolders, beneficiariesData, users } from '@/lib/data/mock-data';
import { Policy, AuditEntry, FieldChange } from '@/lib/types';

export default function PolicyEditClient({ id }: { id: string }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalData, setOriginalData] = useState<Partial<Policy>>({});
  const [formData, setFormData] = useState<Partial<Policy>>({
    policyNumber: '',
    policyType: 'Term Life',
    status: 'Active',
    issueDate: '',
    effectiveDate: '',
    expiryDate: '',
    premiumAmount: 0,
    premiumFrequency: 'Monthly',
    faceAmount: 0,
    cashValue: 0,
    policyholderIds: [],
    beneficiaryIds: [],
    notes: '',
    auditTrail: []
  });

  const [selectedPolicyholders, setSelectedPolicyholders] = useState<string[]>([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [availablePolicyholders, setAvailablePolicyholders] = useState(policyHolders);
  const [availableBeneficiaries, setAvailableBeneficiaries] = useState(beneficiariesData);

  // Load policy data
  useEffect(() => {
    const policy = policies.find(p => p.id === id);
    
    if (policy) {
      // Store original data for comparison when tracking changes
      setOriginalData({...policy});
      
      setFormData({
        ...policy,
      });

      // Set selected policyholders and beneficiaries
      setSelectedPolicyholders(policy.policyholderIds || []);
      setSelectedBeneficiaries(policy.beneficiaryIds || []);
      
      setLoading(false);
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'premiumAmount' || name === 'faceAmount' || name === 'cashValue') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePolicyholderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setSelectedPolicyholders(selectedValues);
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setSelectedBeneficiaries(selectedValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track field changes for audit trail
    const fieldChanges: FieldChange[] = [];
    
    // Compare original and new values for simple fields
    Object.keys(formData).forEach(key => {
      if (key !== 'policyholderIds' && key !== 'beneficiaryIds' && key !== 'auditTrail' && 
          formData[key as keyof Policy] !== originalData[key as keyof Policy]) {
        fieldChanges.push({
          field: key,
          oldValue: originalData[key as keyof Policy],
          newValue: formData[key as keyof Policy]
        });
      }
    });
    
    // Compare policyholders
    if (JSON.stringify(selectedPolicyholders) !== JSON.stringify(originalData.policyholderIds)) {
      fieldChanges.push({
        field: 'policyholderIds',
        oldValue: originalData.policyholderIds,
        newValue: selectedPolicyholders
      });
    }
    
    // Compare beneficiaries
    if (JSON.stringify(selectedBeneficiaries) !== JSON.stringify(originalData.beneficiaryIds)) {
      fieldChanges.push({
        field: 'beneficiaryIds',
        oldValue: originalData.beneficiaryIds,
        newValue: selectedBeneficiaries
      });
    }
    
    // Create audit trail entry for the update
    const auditEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user-001', // In a real app, this would be the logged-in user's ID
      userName: 'Admin User', // In a real app, this would be the logged-in user's name
      action: 'update',
      entityType: 'policy',
      entityId: id,
      changes: fieldChanges,
      notes: `Policy updated on ${new Date().toLocaleString()}`
    };
    
    // Update the policy with the new data and audit trail
    const updatedPolicy: Policy = {
      ...formData as Policy,
      policyholderIds: selectedPolicyholders,
      beneficiaryIds: selectedBeneficiaries,
      auditTrail: [
        ...(formData.auditTrail || []),
        auditEntry
      ]
    };
    
    // In a real app, this would be an API call to update the policy
    console.log('Updated policy:', updatedPolicy);
    
    // Redirect back to the policy detail page
    router.push(`/policies/${id}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
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
            <p className="text-red-500">Policy not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href={`/policies/${id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policy Details
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Policy {formData.policyNumber}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update policy details and information.
              </p>
            </div>
            <div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                formData.status === 'Active' ? 'bg-green-100 text-green-800' :
                formData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                formData.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                formData.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                formData.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                formData.status === 'Paid Up' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.status}
              </span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic policy details and coverage information.</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      {/* Policy Number */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          name="policyNumber"
                          id="policyNumber"
                          value={formData.policyNumber || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      {/* Policy Type */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="policyType" className="block text-sm font-medium text-gray-700">
                          Policy Type
                        </label>
                        <select
                          id="policyType"
                          name="policyType"
                          value={formData.policyType || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          aria-label="Policy type"
                          title="Select policy type"
                        >
                          <option value="Term Life">Term Life</option>
                          <option value="Whole Life">Whole Life</option>
                          <option value="Universal Life">Universal Life</option>
                          <option value="Variable Life">Variable Life</option>
                          <option value="Annuity">Annuity</option>
                          <option value="Group Life">Group Life</option>
                        </select>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          aria-label="Policy status"
                          title="Select policy status"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Lapsed">Lapsed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Expired">Expired</option>
                          <option value="Paid Up">Paid Up</option>
                        </select>
                      </div>
                      
                      {/* Issue Date */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          name="issueDate"
                          id="issueDate"
                          value={formData.issueDate ? formData.issueDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      {/* Effective Date */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                          Effective Date
                        </label>
                        <input
                          type="date"
                          name="effectiveDate"
                          id="effectiveDate"
                          value={formData.effectiveDate ? formData.effectiveDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      {/* Expiry Date */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          id="expiryDate"
                          value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      {/* Premium Amount */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="premiumAmount" className="block text-sm font-medium text-gray-700">
                          Premium Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="premiumAmount"
                            id="premiumAmount"
                            value={formData.premiumAmount || 0}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Premium Frequency */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="premiumFrequency" className="block text-sm font-medium text-gray-700">
                          Premium Frequency
                        </label>
                        <select
                          id="premiumFrequency"
                          name="premiumFrequency"
                          value={formData.premiumFrequency || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          aria-label="Premium frequency"
                          title="Select premium payment frequency"
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Semi-Annual">Semi-Annual</option>
                          <option value="Annual">Annual</option>
                          <option value="Single">Single</option>
                        </select>
                      </div>
                      
                      {/* Face Amount */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="faceAmount" className="block text-sm font-medium text-gray-700">
                          Face Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="faceAmount"
                            id="faceAmount"
                            value={formData.faceAmount || 0}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Cash Value */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="cashValue" className="block text-sm font-medium text-gray-700">
                          Cash Value
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="cashValue"
                            id="cashValue"
                            value={formData.cashValue || 0}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      {/* Policyholders */}
                      <div className="col-span-6">
                        <label htmlFor="policyholders" className="block text-sm font-medium text-gray-700">
                          Policyholders
                        </label>
                        <select
                          id="policyholders"
                          name="policyholders"
                          multiple
                          value={selectedPolicyholders}
                          onChange={handlePolicyholderChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          size={4}
                          aria-label="Select policyholders"
                          title="Select one or more policyholders"
                        >
                          {policyHolders.map(ph => (
                            <option key={ph.id} value={ph.id}>
                              {ph.firstName} {ph.lastName} ({ph.email})
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple policyholders</p>
                      </div>
                      
                      {/* Beneficiaries */}
                      <div className="col-span-6">
                        <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700">
                          Beneficiaries
                        </label>
                        <select
                          id="beneficiaries"
                          name="beneficiaries"
                          multiple
                          value={selectedBeneficiaries}
                          onChange={handleBeneficiaryChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          size={4}
                          aria-label="Select beneficiaries"
                          title="Select one or more beneficiaries"
                        >
                          {beneficiariesData.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.firstName} {b.lastName} ({b.relationship})
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple beneficiaries</p>
                      </div>
                      
                      {/* Notes */}
                      <div className="col-span-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes || ''}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Link
                      href={`/policies/${id}`}
                      className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Trail</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">History of changes to this policy.</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-0">
                    <div className="sm:divide-y sm:divide-gray-200">
                      {formData.auditTrail && formData.auditTrail.length > 0 ? (
                        <div className="overflow-y-auto max-h-96">
                          {formData.auditTrail.map((entry) => (
                            <dl key={entry.id} className="px-4 py-4 sm:px-6 border-b border-gray-200">
                              <div className="flex items-center mb-2">
                                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">Timestamp</dt>
                                <dd className="text-sm text-gray-500">{formatDate(entry.timestamp)}</dd>
                              </div>
                              <div className="flex items-center mb-2">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">User</dt>
                                <dd className="text-sm font-medium text-gray-900">{entry.userName}</dd>
                              </div>
                              <div className="flex items-center mb-2">
                                <PencilSquareIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <dt className="sr-only">Action</dt>
                                <dd className="text-sm text-gray-700 capitalize">{entry.action}</dd>
                              </div>
                              {entry.changes && entry.changes.length > 0 && (
                                <div className="mt-2 border-t border-gray-100 pt-2">
                                  <dt className="sr-only">Changes</dt>
                                  <dd>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Changes:</h4>
                                    <ul className="space-y-1">
                                      {entry.changes.map((change, idx) => (
                                        <li key={`${change.field}-${idx}`} className="text-xs">
                                          <span className="font-medium">{change.field}:</span> {change.oldValue ? String(change.oldValue) : "(empty)"} → {change.newValue ? String(change.newValue) : "(empty)"}
                                        </li>
                                      ))}
                                    </ul>
                                  </dd>
                                </div>
                              )}
                              {entry.notes && (
                                <div className="mt-2">
                                  <dt className="sr-only">Notes</dt>
                                  <dd className="text-sm text-gray-600">{entry.notes}</dd>
                                </div>
                              )}
                            </dl>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-5 sm:px-6">
                          <p className="text-sm text-gray-500">No audit records found for this policy.</p>
                          <p className="text-sm text-gray-500 mt-1">Changes made in this session will be recorded when you save.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Related Actions</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Quick links for policy management.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-2">
                      <Link href={`/policies/${id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        View Policy Details
                      </Link>
                    </li>
                    <li className="py-2">
                      <Link href={`/policies/${id}/documents`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Manage Documents
                      </Link>
                    </li>
                    <li className="py-2">
                      <Link href={`/reports/audit-trails?entityId=${id}&entityType=policy`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        View Full Audit Trail
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
