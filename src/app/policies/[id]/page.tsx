'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  UserIcon,
  DocumentTextIcon,
  PencilIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policies, policyHolders, beneficiariesData, benefits, policyBreakdowns } from '@/lib/data/mock-data';

export default function PolicyDetail() {
  const { id } = useParams();
  const policyId = Array.isArray(id) ? id[0] : id;
  
  const policy = policies.find(p => p.id === policyId);
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

  // Get policyholders, beneficiaries, and related data
  const policyholders = policy.policyholderIds?.map(id => policyHolders.find(ph => ph.id === id)).filter(Boolean) || [];
  const policyBeneficiaries = beneficiariesData.filter(b => policy.beneficiaryIds?.includes(b.id));
  const policyBenefits = benefits.filter(b => b.policyId === policy.id);
  const breakdown = policyBreakdowns.find(pb => pb.policyId === policy.id);

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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const tabs = [
    { name: 'Overview', href: '#overview', current: true },
    { name: 'Riders', href: '#riders', current: false },
    { name: 'Beneficiaries', href: '#beneficiaries', current: false },
    { name: 'Documents', href: '#documents', current: false },
    { name: 'History', href: '#history', current: false },
  ];

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href="/policies" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Policies
          </Link>
        </div>

        {/* Policy Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Policy {policy.policyNumber}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">
                {policy.policyType} Insurance Policy
              </p>
            </div>
            <div className="flex space-x-4 items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                policy.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                policy.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                policy.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                policy.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                policy.status === 'Paid Up' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {policy.status}
              </span>
              <Link
                href={`/policies/${policy.id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
                Edit Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Policy Overview */}
        <div id="overview" className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">Core policy information and coverage details.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.policyNumber}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Policy Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.policyType}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                    policy.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    policy.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                    policy.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    policy.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                    policy.status === 'Paid Up' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {policy.status}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(policy.issueDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(policy.effectiveDate)}</dd>
              </div>
              {policy.expiryDate && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(policy.expiryDate)}</dd>
                </div>
              )}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Face Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(policy.faceAmount)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Premium</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatCurrency(policy.premiumAmount)} / {policy.premiumFrequency.toLowerCase().replace('semi-annual', 'semi-annually').replace('annual', 'annually')}
                </dd>
              </div>
              {policy.cashValue !== undefined && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cash Value</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(policy.cashValue)}</dd>
                </div>
              )}
              {policy.notes && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Policyholders */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Policyholders</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">Primary and additional policyholders.</p>
          </div>
          <div className="border-t border-gray-200">
            {policyholders.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {policyholders.map((policyholder, index) => (
                  <li key={policyholder?.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-semibold">
                          {policyholder?.firstName.charAt(0)}{policyholder?.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {policyholder?.firstName} {policyholder?.lastName}
                          </div>
                          <div className="text-sm text-gray-700">
                            {index === 0 ? 'Primary Policyholder' : 'Additional Policyholder'}
                          </div>
                          {policyholder?.email && (
                            <div className="text-sm text-gray-700">{policyholder?.email}</div>
                          )}
                        </div>
                      </div>
                      <Link href={`/policyholders/${policyholder?.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No policyholders assigned to this policy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Riders */}
        <div id="riders" className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Riders</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">Additional coverages and policy enhancements.</p>
          </div>
          <div className="border-t border-gray-200">
            {policy.riders && policy.riders.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {policy.riders.map((rider) => (
                  <li key={rider.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                        <div className="text-sm text-gray-700">{rider.description}</div>
                        <div className="mt-1 flex items-center text-xs text-gray-700">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                            rider.status === 'Active' ? 'bg-green-100 text-green-800' :
                            rider.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rider.status}
                          </span>
                          <span>Effective: {formatDate(rider.effectiveDate)}</span>
                          {rider.expiryDate && (
                            <span className="ml-2">Expires: {formatDate(rider.expiryDate)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(rider.cost)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No riders attached to this policy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Beneficiaries */}
        <div id="beneficiaries" className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Beneficiaries</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">Policy beneficiaries and their details.</p>
            </div>
            <Link href={`/beneficiaries?policyId=${policy.id}`} className="text-indigo-600 hover:text-indigo-900">
              Manage Beneficiaries
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {policyBeneficiaries.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {policyBeneficiaries.map((beneficiary) => (
                  <li key={beneficiary.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-semibold">
                          {beneficiary.firstName.charAt(0)}{beneficiary.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {beneficiary.firstName} {beneficiary.lastName}
                          </div>
                          <div className="text-sm text-gray-700">
                            {beneficiary.relationship}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 font-medium mr-4">
                          {beneficiary.percentage}%
                        </div>
                        <Link href={`/beneficiaries/${beneficiary.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No beneficiaries assigned to this policy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div id="documents" className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">Policy documents and related files.</p>
          </div>
          <div className="border-t border-gray-200">
            {policy.documents && policy.documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {policy.documents.map((document) => (
                  <li key={document.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                          <DocumentTextIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-700">
                            {document.type} • {formatFileSize(document.size)} • Uploaded {formatDate(document.uploadDate)}
                          </div>
                        </div>
                      </div>
                      <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                        View
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No documents available for this policy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Audit Trail / History */}
        <div id="history" className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Policy History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">Audit trail of policy changes and updates.</p>
          </div>
          <div className="border-t border-gray-200">
            {policy.auditTrail && policy.auditTrail.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {policy.auditTrail.map((entry) => (
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
                            {entry.action === 'create' && 'Policy Created'}
                            {entry.action === 'update' && 'Policy Updated'}
                            {entry.action === 'delete' && 'Policy Deleted'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-700 flex items-center">
                          <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {entry.userName}
                        </div>
                        {entry.notes && (
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{entry.notes}</p>
                          </div>
                        )}
                        {entry.changes && entry.changes.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Changes</h4>
                            <div className="mt-1 bg-gray-100 rounded-md p-3 border-2 border-gray-300">
                              <ul className="space-y-2">
                                {entry.changes.map((change, index) => (
                                  <li key={index} className="text-sm">
                                    <span className="font-medium text-black">{change.field}</span>: 
                                    <span className="text-red-700 font-medium line-through ml-1 mr-1">
                                      {change.oldValue === null ? 'none' : String(change.oldValue)}
                                    </span>
                                    <span className="text-black mx-1">→</span>
                                    <span className="text-green-700 font-medium ml-1">
                                      {change.newValue === null ? 'none' : String(change.newValue)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">No history available for this policy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
