'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { 
  ChartPieIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  UserIcon, 
  ShieldCheckIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Report types for the dashboard
const reportTypes = [
  {
    id: 'audit-trails',
    name: 'Audit Trails',
    description: 'View detailed history of changes across the system',
    icon: ClockIcon,
    href: '/reports/audit-trails',
    color: 'bg-blue-500',
  },
  {
    id: 'policy-activity',
    name: 'Policy Activity',
    description: 'Track policy creations, modifications, and status changes',
    icon: DocumentTextIcon,
    href: '/reports/policy-activity',
    color: 'bg-green-500',
  },
  {
    id: 'benefit-utilization',
    name: 'Benefit Utilization',
    description: 'Analyze benefit usage and claim patterns',
    icon: ShieldCheckIcon,
    href: '/reports/benefit-utilization',
    color: 'bg-purple-500',
  },
  {
    id: 'user-activity',
    name: 'User Activity',
    description: 'Monitor user actions and system access',
    icon: UserIcon,
    href: '/reports/user-activity',
    color: 'bg-yellow-500',
  },
  {
    id: 'custom-reports',
    name: 'Custom Reports',
    description: 'Build and save your own custom reports',
    icon: ChartPieIcon,
    href: '/reports/custom',
    color: 'bg-red-500',
  },
];

export default function ReportsPage() {
  const [recentReports, setRecentReports] = useState([
    {
      id: 'rep-001',
      name: 'March Policy Changes',
      type: 'Audit Trail',
      runDate: '2025-04-01',
      status: 'Completed'
    },
    {
      id: 'rep-002',
      name: 'Q1 Benefit Utilization',
      type: 'Benefit Utilization',
      runDate: '2025-04-05',
      status: 'Completed'
    },
    {
      id: 'rep-003',
      name: 'Admin User Activity',
      type: 'User Activity',
      runDate: '2025-04-10',
      status: 'Completed'
    },
  ]);

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-retro-light">Reports</h1>
            <p className="mt-2 text-sm text-gray-400">
              Generate and view detailed reports for your policy administration system
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
            >
              <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reportTypes.map((report) => (
            <Link
              key={report.id}
              href={report.href}
              className="relative group bg-gray-800 p-6 rounded-lg shadow-retro-md border-2 border-gray-700 hover:border-retro-primary transition-all duration-200 overflow-hidden"
            >
              <div className={`${report.color} absolute top-0 right-0 w-16 h-16 -mt-6 -mr-6 rounded-full opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative">
                <report.icon className="h-8 w-8 text-retro-light mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-retro-light">{report.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{report.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="mt-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-retro-light">Recent Reports</h2>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Filter
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Run Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-retro-light">{report.name}</div>
                      <div className="text-sm text-gray-400">{report.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{report.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{report.runDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/reports/view/${report.id}`} className="text-retro-info hover:text-retro-primary">
                        View
                      </Link>
                      <span className="mx-2 text-gray-600">|</span>
                      <Link href={`/reports/download/${report.id}`} className="text-retro-info hover:text-retro-primary">
                        Download
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
