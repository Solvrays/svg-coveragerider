'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  DocumentTextIcon, 
  UserIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { policies, policyHolders } from '@/lib/data/mock-data';
import { Policy } from '@/lib/types';

// Calculate statistics
const totalPolicies = policies.length;
const activePolicies = policies.filter(policy => policy.status === 'Active').length;
const pendingPolicies = policies.filter(policy => policy.status === 'Pending').length;
const totalPolicyHolders = policyHolders.length;

// Get policies with upcoming premium due dates
const upcomingPremiums = [...policies]
  .filter(policy => policy.status === 'Active')
  .sort((a, b) => {
    // Calculate next due date based on effectiveDate and premiumFrequency
    const getNextDueDate = (policy: Policy) => {
      const effectiveDate = new Date(policy.effectiveDate);
      const today = new Date();
      const monthsToAdd = 
        policy.premiumFrequency === 'Monthly' ? 1 :
        policy.premiumFrequency === 'Quarterly' ? 3 :
        policy.premiumFrequency === 'Semi-Annual' ? 6 :
        policy.premiumFrequency === 'Annual' ? 12 : 0;
      
      if (monthsToAdd === 0) return effectiveDate; // Single premium case
      
      // Find the next due date after today
      const nextDueDate = new Date(effectiveDate);
      while (nextDueDate < today) {
        nextDueDate.setMonth(nextDueDate.getMonth() + monthsToAdd);
      }
      
      return nextDueDate;
    };
    
    return getNextDueDate(a).getTime() - getNextDueDate(b).getTime();
  })
  .slice(0, 5);

// Get recent policies
const recentPolicies = [...policies]
  .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
  .slice(0, 5);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  
  return (
    <DashboardLayout>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Policies */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Policies</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalPolicies}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-green-600">
                      <ArrowUpIcon className="inline h-4 w-4 mr-1" />
                      5.3%
                    </span>{' '}
                    vs last {timeRange}
                  </div>
                  <div>
                    <label htmlFor="timeRange1" className="sr-only">Time range</label>
                    <select
                      id="timeRange1"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="text-xs text-gray-500 border-none bg-transparent focus:ring-0"
                    >
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Policies */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Policies</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{activePolicies}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-green-600">
                      <ArrowUpIcon className="inline h-4 w-4 mr-1" />
                      3.2%
                    </span>{' '}
                    vs last {timeRange}
                  </div>
                  <div>
                    <label htmlFor="timeRange2" className="sr-only">Time range</label>
                    <select
                      id="timeRange2"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="text-xs text-gray-500 border-none bg-transparent focus:ring-0"
                    >
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Policies */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <ExclamationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Policies</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{pendingPolicies}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-red-600">
                      <ArrowDownIcon className="inline h-4 w-4 mr-1" />
                      1.5%
                    </span>{' '}
                    vs last {timeRange}
                  </div>
                  <div>
                    <label htmlFor="timeRange3" className="sr-only">Time range</label>
                    <select
                      id="timeRange3"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="text-xs text-gray-500 border-none bg-transparent focus:ring-0"
                    >
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Policyholders */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <UserIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Policyholders</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalPolicyHolders}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-green-600">
                      <ArrowUpIcon className="inline h-4 w-4 mr-1" />
                      2.7%
                    </span>{' '}
                    vs last {timeRange}
                  </div>
                  <div>
                    <label htmlFor="timeRange4" className="sr-only">Time range</label>
                    <select
                      id="timeRange4"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="text-xs text-gray-500 border-none bg-transparent focus:ring-0"
                    >
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Premium Payments */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Premium Payments</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {upcomingPremiums.map((policy) => {
                const policyHolder = policyHolders.find(ph => ph.id === policy.policyholderIds[0]);
                return (
                  <li key={policy.id}>
                    <Link href={`/policies/${policy.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {policy.policyNumber}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                policy.policyType === 'Whole Life' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {policy.policyType}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              Due: {new Date(policy.effectiveDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              {policyHolder ? `${policyHolder.firstName} ${policyHolder.lastName}` : 'Unknown'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              ${policy.premiumAmount.toFixed(2)} ({policy.premiumFrequency})
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Recent Policies */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Policies</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {recentPolicies.map((policy) => {
                const policyHolder = policyHolders.find(ph => ph.id === policy.policyholderIds[0]);
                return (
                  <li key={policy.id}>
                    <Link href={`/policies/${policy.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {policy.policyNumber}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {policy.status}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              Issued: {new Date(policy.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              {policyHolder ? `${policyHolder.firstName} ${policyHolder.lastName}` : 'Unknown'}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                policy.policyType === 'Whole Life' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {policy.policyType}
                              </span>
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              ${policy.faceAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
