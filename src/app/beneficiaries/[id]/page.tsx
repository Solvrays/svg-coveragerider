'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  PencilIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { beneficiariesData, policies } from '@/lib/data/mock-data';

export default function BeneficiaryDetail() {
  const { id } = useParams();
  const beneficiaryId = Array.isArray(id) ? id[0] : id;
  
  const beneficiary = beneficiariesData.find(b => b.id === beneficiaryId);
  if (!beneficiary) {
    return (
      <DashboardLayout>
        <div className="py-4">
          <div className="flex items-center mb-6">
            <Link href="/beneficiaries" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Beneficiaries
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <p className="text-red-500">Beneficiary not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const policy = policies.find(p => p.id === beneficiary.policyId);
  const hasAuditTrail = beneficiary.auditTrail && beneficiary.auditTrail.length > 0;

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex items-center mb-6">
          <Link href="/beneficiaries" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Beneficiaries
          </Link>
        </div>

        {/* Beneficiary Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-semibold">
                {beneficiary.firstName.charAt(0)}{beneficiary.lastName.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {beneficiary.firstName} {beneficiary.lastName}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-700">
                  <span className="mr-2">{beneficiary.relationship}</span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {beneficiary.percentage}% allocation
                  </span>
                </div>
                {beneficiary.email && (
                  <div className="mt-1 flex items-center text-sm text-gray-700">
                    <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                    <span>{beneficiary.email}</span>
                  </div>
                )}
                {beneficiary.phone && (
                  <div className="mt-1 flex items-center text-sm text-gray-700">
                    <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                    <span>{beneficiary.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Link
                href={`/beneficiaries/${beneficiary.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="h-5 w-5 mr-2 text-gray-500" aria-hidden="true" />
                Edit Beneficiary
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Beneficiary Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Beneficiary Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">Personal details and contact information.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {beneficiary.firstName} {beneficiary.lastName}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{beneficiary.relationship}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(beneficiary.dateOfBirth).toLocaleDateString()}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">SSN</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{beneficiary.ssn}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {beneficiary.email || <span className="text-gray-500 italic">Not provided</span>}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {beneficiary.phone || <span className="text-gray-500 italic">Not provided</span>}
                  </dd>
                </div>
                {beneficiary.address && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {beneficiary.address.street}<br />
                      {beneficiary.address.city}, {beneficiary.address.state} {beneficiary.address.zipCode}<br />
                      {beneficiary.address.country}
                    </dd>
                  </div>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Allocation Percentage</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="font-semibold">{beneficiary.percentage}%</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Policy Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-700">Details about the associated policy.</p>
            </div>
            {policy ? (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <Link href={`/policies/${policy.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {policy.policyNumber}
                      </Link>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Policy Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.policyType}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                        policy.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        policy.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.status}
                      </span>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Face Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      ${policy.faceAmount.toLocaleString()}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(policy.issueDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(policy.effectiveDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Other Beneficiaries</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <Link 
                        href={`/beneficiaries?policyId=${policy.id}`} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View all beneficiaries for this policy
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700">Policy information not available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Trail</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">
              History of changes to this beneficiary record.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {hasAuditTrail ? (
              <ul className="divide-y divide-gray-200">
                {beneficiary.auditTrail!.map((entry, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {entry.action === 'create' && (
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <PlusIcon className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                        {entry.action === 'update' && (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <PencilIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                        {entry.action === 'delete' && (
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <TrashIcon className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.action === 'create' && 'Created'}
                            {entry.action === 'update' && 'Updated'}
                            {entry.action === 'delete' && 'Deleted'}
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
                <p className="text-sm text-gray-700">No audit trail available for this beneficiary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Icons for audit trail
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 4v16m8-8H4" 
      />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
      />
    </svg>
  );
}
