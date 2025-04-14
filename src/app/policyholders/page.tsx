'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policyHolders, policies } from '@/lib/data/mock-data';

export default function PolicyholdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterRiskClass, setFilterRiskClass] = useState('All');
  const [filterSmoker, setFilterSmoker] = useState('All');
  const [filterMaritalStatus, setFilterMaritalStatus] = useState('All');

  // Get unique values for filters
  const riskClasses = ['All', ...new Set(policyHolders
    .filter(ph => ph.riskClass)
    .map(ph => ph.riskClass as string))];
  
  const smokerStatuses = ['All', ...new Set(policyHolders
    .filter(ph => ph.smokerStatus)
    .map(ph => ph.smokerStatus as string))];
  
  const maritalStatuses = ['All', ...new Set(policyHolders
    .filter(ph => ph.maritalStatus)
    .map(ph => ph.maritalStatus as string))];

  // Filter and sort policyholders
  const filteredPolicyholders = policyHolders.filter(policyholder => {
    const fullName = `${policyholder.firstName} ${policyholder.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) || 
      policyholder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policyholder.phone.includes(searchQuery) ||
      (policyholder.occupation && policyholder.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (policyholder.employer && policyholder.employer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRiskClass = filterRiskClass === 'All' || policyholder.riskClass === filterRiskClass;
    const matchesSmoker = filterSmoker === 'All' || policyholder.smokerStatus === filterSmoker;
    const matchesMaritalStatus = filterMaritalStatus === 'All' || policyholder.maritalStatus === filterMaritalStatus;
    
    return matchesSearch && matchesRiskClass && matchesSmoker && matchesMaritalStatus;
  });

  const sortedPolicyholders = [...filteredPolicyholders].sort((a, b) => {
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
      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;
      case 'phone':
        aValue = a.phone;
        bValue = b.phone;
        break;
      case 'policies':
        aValue = a.policies.length;
        bValue = b.policies.length;
        break;
      case 'riskClass':
        aValue = a.riskClass || '';
        bValue = b.riskClass || '';
        break;
      case 'smokerStatus':
        aValue = a.smokerStatus || '';
        bValue = b.smokerStatus || '';
        break;
      case 'dateOfBirth':
        aValue = new Date(a.dateOfBirth).getTime();
        bValue = new Date(b.dateOfBirth).getTime();
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

  // Calculate stats
  const totalPolicyholders = policyHolders.length;
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(policy => policy.status === 'Active').length;
  const averagePoliciesPerHolder = totalPolicies / totalPolicyholders;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Policyholders</h1>
          <Link
            href="/policyholders/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Policyholder
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <UserGroupIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Policyholders</dt>
                    <dd className="text-lg font-semibold text-gray-900">{totalPolicyholders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Policies</dt>
                    <dd className="text-lg font-semibold text-gray-900">{totalPolicies}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Policies</dt>
                    <dd className="text-lg font-semibold text-gray-900">{activePolicies}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <UserGroupIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Policies per Holder</dt>
                    <dd className="text-lg font-semibold text-gray-900">{averagePoliciesPerHolder.toFixed(1)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
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
                placeholder="Search policyholders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="relative inline-block text-left">
              <select
                aria-label="Filter by risk class"
                title="Risk Class"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterRiskClass}
                onChange={(e) => setFilterRiskClass(e.target.value)}
              >
                {riskClasses.map(riskClass => (
                  <option key={riskClass} value={riskClass}>{riskClass}</option>
                ))}
              </select>
            </div>
            
            <div className="relative inline-block text-left">
              <select
                aria-label="Filter by smoker status"
                title="Smoker Status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterSmoker}
                onChange={(e) => setFilterSmoker(e.target.value)}
              >
                {smokerStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="relative inline-block text-left">
              <select
                aria-label="Filter by marital status"
                title="Marital Status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterMaritalStatus}
                onChange={(e) => setFilterMaritalStatus(e.target.value)}
              >
                {maritalStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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

        {/* Policyholders Table */}
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
                        onClick={() => handleSort('dateOfBirth')}
                      >
                        <div className="flex items-center">
                          Age/DOB
                          <SortIcon field="dateOfBirth" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('riskClass')}
                      >
                        <div className="flex items-center">
                          Risk Profile
                          <SortIcon field="riskClass" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('policies')}
                      >
                        <div className="flex items-center">
                          Policies
                          <SortIcon field="policies" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPolicyholders.map((policyholder) => {
                      const policyCount = policyholder.policies.length;
                      const activePolicies = policies.filter(
                        policy => policyholder.policies.includes(policy.id) && policy.status === 'Active'
                      ).length;
                      const age = calculateAge(policyholder.dateOfBirth);
                      
                      return (
                        <tr key={policyholder.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                {policyholder.firstName.charAt(0)}{policyholder.lastName.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-indigo-600">
                                  <Link href={`/policyholders/${policyholder.id}`}>
                                    {policyholder.firstName} {policyholder.lastName}
                                  </Link>
                                </div>
                                {policyholder.occupation && (
                                  <div className="text-sm text-gray-700">
                                    {policyholder.occupation}
                                    {policyholder.employer && ` at ${policyholder.employer}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{age} years</div>
                            <div className="text-xs text-gray-700">{formatDate(policyholder.dateOfBirth)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              {policyholder.riskClass && (
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1 ${
                                  policyholder.riskClass === 'Preferred Plus' ? 'bg-green-100 text-green-800' :
                                  policyholder.riskClass === 'Preferred' ? 'bg-green-100 text-green-800' :
                                  policyholder.riskClass === 'Standard Plus' ? 'bg-blue-100 text-blue-800' :
                                  policyholder.riskClass === 'Standard' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {policyholder.riskClass}
                                </span>
                              )}
                              {policyholder.smokerStatus && (
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  policyholder.smokerStatus === 'Non-smoker' ? 'bg-green-100 text-green-800' :
                                  policyholder.smokerStatus === 'Former Smoker' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {policyholder.smokerStatus}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{policyCount} policies</div>
                            <div className="text-xs text-gray-700">{activePolicies} active</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{policyholder.email}</div>
                            <div className="text-sm text-gray-700">{policyholder.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/policyholders/${policyholder.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              View
                            </Link>
                            <Link href={`/policyholders/${policyholder.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
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
