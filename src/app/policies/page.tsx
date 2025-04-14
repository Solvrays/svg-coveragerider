'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowUpIcon, 
  ArrowDownIcon 
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policies, policyHolders } from '@/lib/data/mock-data';

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('policyNumber');
  const [sortDirection, setSortDirection] = useState('asc');

  // Get unique policy types and statuses for filters
  const policyTypes = ['All', ...new Set(policies.map(policy => policy.policyType))];
  const policyStatuses = ['All', ...new Set(policies.map(policy => policy.status))];

  // Filter and sort policies
  const filteredPolicies = policies.filter(policy => {
    // Get policyholder names for searching
    const policyholderNames = policy.policyholderIds?.map(id => {
      const holder = policyHolders.find(ph => ph.id === id);
      return holder ? `${holder.firstName} ${holder.lastName}`.toLowerCase() : '';
    }).join(' ') || '';
    
    const matchesSearch = 
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policyholderNames.includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || policy.status === filterStatus;
    const matchesType = filterType === 'All' || policy.policyType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'policyNumber':
        aValue = a.policyNumber;
        bValue = b.policyNumber;
        break;
      case 'policyHolder':
        // Get primary policyholder (first in the array)
        const aHolderId = a.policyholderIds?.[0];
        const bHolderId = b.policyholderIds?.[0];
        const aHolder = policyHolders.find(ph => ph.id === aHolderId);
        const bHolder = policyHolders.find(ph => ph.id === bHolderId);
        aValue = aHolder ? `${aHolder.lastName}, ${aHolder.firstName}` : '';
        bValue = bHolder ? `${bHolder.lastName}, ${bHolder.firstName}` : '';
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'type':
        aValue = a.policyType;
        bValue = b.policyType;
        break;
      case 'faceAmount':
        aValue = a.faceAmount;
        bValue = b.faceAmount;
        break;
      case 'premium':
        aValue = a.premiumAmount;
        bValue = b.premiumAmount;
        break;
      case 'issueDate':
        aValue = new Date(a.issueDate).getTime();
        bValue = new Date(b.issueDate).getTime();
        break;
      default:
        aValue = a.policyNumber;
        bValue = b.policyNumber;
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Policies</h1>
          <Link
            href="/policies/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Policy
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-1 max-w-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="relative inline-block text-left">
              <select
                aria-label="Filter by policy status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {policyStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="relative inline-block text-left">
              <select
                aria-label="Filter by policy type"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {policyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
              More Filters
            </button>
          </div>
        </div>

        {/* Policies Table */}
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
                        onClick={() => handleSort('policyNumber')}
                      >
                        <div className="flex items-center">
                          Policy Number
                          <SortIcon field="policyNumber" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('policyHolder')}
                      >
                        <div className="flex items-center">
                          Policyholder
                          <SortIcon field="policyHolder" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center">
                          Type
                          <SortIcon field="type" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('faceAmount')}
                      >
                        <div className="flex items-center">
                          Face Amount
                          <SortIcon field="faceAmount" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('premium')}
                      >
                        <div className="flex items-center">
                          Premium
                          <SortIcon field="premium" />
                        </div>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPolicies.map((policy) => {
                      // Get primary policyholder (first in the array)
                      const primaryHolderId = policy.policyholderIds?.[0];
                      const policyHolder = policyHolders.find(ph => ph.id === primaryHolderId);
                      
                      return (
                        <tr key={policy.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-indigo-600">
                              <Link href={`/policies/${policy.id}`}>
                                {policy.policyNumber}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {policyHolder ? `${policyHolder.firstName} ${policyHolder.lastName}` : 'Unknown'}
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
                              policy.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              policy.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                              policy.status === 'Paid Up' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {policy.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(policy.faceAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(policy.premiumAmount)}
                            <span className="text-xs text-gray-500 ml-1">
                              /{policy.premiumFrequency.toLowerCase().replace('semi-annual', 'semi-annually').replace('annual', 'annually')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/policies/${policy.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              View
                            </Link>
                            <Link href={`/policies/${policy.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
