'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getPolicyHolder, getPolicies } from '@/lib/services/mockDataService';
import { PolicyHolder, Policy } from '@/lib/types';

export default function PolicyholderDetail() {
  const { id } = useParams();
  const policyHolderId = Array.isArray(id) ? id[0] : id;
  
  const [policyholder, setPolicyholder] = useState<PolicyHolder | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load data from mock service
  useEffect(() => {
    const loadData = async () => {
      try {
        const policyholderData = await getPolicyHolder(policyHolderId);
        const policiesData = await getPolicies();
        
        if (policyholderData) {
          setPolicyholder(policyholderData);
          setPolicies(policiesData);
        } else {
          setNotFound(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    loadData();
  }, [policyHolderId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href="/policyholders" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policyholders
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-gray-500">Loading policyholder details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (notFound || !policyholder) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href="/policyholders" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Policyholders
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-red-500">Policyholder not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const policyholderPolicies = policies.filter(policy => 
    policyholder.policies && policyholder.policies.includes(policy.id)
  );
  const activePolicies = policyholderPolicies.filter(policy => policy.status === 'Active');
  const pendingPolicies = policyholderPolicies.filter(policy => policy.status === 'Pending');
  
  const totalCoverage = policyholderPolicies.reduce((sum, policy) => sum + policy.faceAmount, 0);
  const totalPremium = policyholderPolicies.reduce((sum, policy) => sum + policy.premiumAmount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href="/policyholders" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policyholders
          </Link>
        </div>

        {/* Policyholder Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-semibold">
                  {policyholder.firstName.charAt(0)}{policyholder.lastName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {policyholder.firstName} {policyholder.lastName}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>{policyholder.email}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>{policyholder.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <Link 
                  href={`/policyholders/${policyHolderId}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Policyholder
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Policies</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{policyholderPolicies.length}</dd>
              </dl>
              <div className="mt-1">
                <span className="text-sm text-gray-500">{activePolicies.length} active, {pendingPolicies.length} pending</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Coverage</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(totalCoverage)}</dd>
              </dl>
              <div className="mt-1">
                <span className="text-sm text-gray-500">Across all policies</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Premium</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(totalPremium)}</dd>
              </dl>
              <div className="mt-1">
                <span className="text-sm text-gray-500">Combined premium amount</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Customer Since</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {new Date(
                    Math.min(...policyholderPolicies.map(p => new Date(p.issueDate).getTime()))
                  ).getFullYear()}
                </dd>
              </dl>
              <div className="mt-1">
                <span className="text-sm text-gray-500">First policy issued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policyholder Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Policyholder Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {policyholder.firstName} {policyholder.lastName}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(policyholder.dateOfBirth).toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">SSN</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policyholder.ssn}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policyholder.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policyholder.phone}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {policyholder.address.street}<br />
                  {policyholder.address.city}, {policyholder.address.state} {policyholder.address.zipCode}<br />
                  {policyholder.address.country}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Trail</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">History of changes to this policyholder.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-0">
              <div className="sm:divide-y sm:divide-gray-200">
                {policyholder.auditTrail && policyholder.auditTrail.length > 0 ? (
                  <div className="overflow-y-auto max-h-96">
                    {policyholder.auditTrail.map((entry) => (
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
                              <ul className="space-y-1 text-gray-900">
                                {entry.changes.map((change, index) => (
                                  <li key={`${change.field}-${index}`} className="text-xs">
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
                            <dd className="text-sm text-gray-900">{entry.notes}</dd>
                          </div>
                        )}
                      </dl>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-sm text-gray-500">No audit records found for this policyholder.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Policies</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">All policies owned by this policyholder.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Policy
            </button>
          </div>
          <div className="border-t border-gray-200">
            {policyholderPolicies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Face Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policyholderPolicies.map((policy) => (
                      <tr key={policy.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            <Link href={`/policies/${policy.id}`}>
                              {policy.policyNumber}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{policy.policyType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                            policy.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            policy.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(policy.faceAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(policy.premiumAmount)} ({policy.premiumFrequency})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(policy.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/policies/${policy.id}`} className="text-indigo-600 hover:text-indigo-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">No policies found for this policyholder.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
