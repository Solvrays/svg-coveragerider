'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { beneficiariesData, policies } from '@/lib/data/mock-data';
import { useSearchParams } from 'next/navigation';

// Loading component for Suspense fallback
function BeneficiariesLoading() {
  return (
    <div className="py-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

// Main component that uses search params
function BeneficiariesContent() {
  const searchParams = useSearchParams();
  const policyIdParam = searchParams.get('policyId');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelationship, setFilterRelationship] = useState('All');
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter beneficiaries
  const filteredBeneficiaries = beneficiariesData.filter(beneficiary => {
    const fullName = `${beneficiary.firstName} ${beneficiary.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                         (beneficiary.email && beneficiary.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (beneficiary.phone && beneficiary.phone.includes(searchQuery));
    
    const matchesRelationship = filterRelationship === 'All' || beneficiary.relationship === filterRelationship;
    const matchesPolicy = !policyIdParam || beneficiary.policyId === policyIdParam;
    
    return matchesSearch && matchesRelationship && matchesPolicy;
  });

  // Sort beneficiaries
  const sortedBeneficiaries = [...filteredBeneficiaries].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'firstName':
        aValue = a.firstName;
        bValue = b.firstName;
        break;
      case 'lastName':
        aValue = a.lastName;
        bValue = b.lastName;
        break;
      case 'relationship':
        aValue = a.relationship;
        bValue = b.relationship;
        break;
      case 'percentage':
        aValue = a.percentage;
        bValue = b.percentage;
        break;
      case 'policy':
        const aPolicy = policies.find(p => p.id === a.policyId)?.policyNumber || '';
        const bPolicy = policies.find(p => p.id === b.policyId)?.policyNumber || '';
        aValue = aPolicy;
        bValue = bPolicy;
        break;
      default:
        aValue = a.lastName;
        bValue = b.lastName;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" /> 
      : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };

  // Get unique relationship types for filter
  const relationshipTypes = ['All', ...new Set(beneficiariesData.map(b => b.relationship))];

  return (
    <div className="py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Beneficiaries</h1>
          {policyIdParam && (
            <div className="mt-1">
              <Link href="/policies" className="text-sm text-indigo-600 hover:text-indigo-900">
                Policies
              </Link>
              {' > '}
              <Link 
                href={`/policies/${policyIdParam}`} 
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                {policies.find(p => p.id === policyIdParam)?.policyNumber || policyIdParam}
              </Link>
              {' > Beneficiaries'}
            </div>
          )}
        </div>
        <Link
          href="/beneficiaries/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Beneficiary
        </Link>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative inline-block text-left">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-1" />
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value)}
              aria-label="Filter by relationship type"
              title="Relationship filter"
            >
              {relationshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Relationships' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('lastName')}
                    >
                      <div className="flex items-center">
                        Name
                        <SortIcon field="lastName" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('relationship')}
                    >
                      <div className="flex items-center">
                        Relationship
                        <SortIcon field="relationship" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('percentage')}
                    >
                      <div className="flex items-center">
                        Percentage
                        <SortIcon field="percentage" />
                      </div>
                    </th>
                    {!policyIdParam && (
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('policy')}
                      >
                        <div className="flex items-center">
                          Policy
                          <SortIcon field="policy" />
                        </div>
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audit Trail
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBeneficiaries.map((beneficiary) => {
                    const policy = policies.find(p => p.id === beneficiary.policyId);
                    const hasAuditTrail = beneficiary.auditTrail && beneficiary.auditTrail.length > 0;
                    
                    return (
                      <tr key={beneficiary.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {beneficiary.firstName} {beneficiary.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                DOB: {new Date(beneficiary.dateOfBirth).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{beneficiary.relationship}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{beneficiary.percentage}%</div>
                        </td>
                        {!policyIdParam && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <Link href={`/policies/${policy?.id}`} className="text-indigo-600 hover:text-indigo-900">
                                {policy?.policyNumber || 'Unknown'}
                              </Link>
                            </div>
                            <div className="text-xs text-gray-500">
                              {policy?.policyType || ''}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {beneficiary.email && (
                              <div className="mb-1">{beneficiary.email}</div>
                            )}
                            {beneficiary.phone && (
                              <div>{beneficiary.phone}</div>
                            )}
                            {!beneficiary.email && !beneficiary.phone && (
                              <div className="text-gray-500 italic">No contact info</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {hasAuditTrail ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {beneficiary.auditTrail?.length} changes
                              </span>
                            ) : (
                              <span className="text-gray-500 italic">No audit trail</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/beneficiaries/${beneficiary.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            View
                          </Link>
                          <Link href={`/beneficiaries/${beneficiary.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {sortedBeneficiaries.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 text-sm">No beneficiaries found matching your criteria.</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRelationship('All');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function BeneficiariesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<BeneficiariesLoading />}>
        <BeneficiariesContent />
      </Suspense>
    </DashboardLayout>
  );
}
