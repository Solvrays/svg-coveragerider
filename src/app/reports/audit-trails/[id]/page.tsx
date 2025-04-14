'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { AuditEntry } from '@/lib/types';
import { benefits, policyHolders, policies } from '@/lib/data/mock-data';

// Find audit entry by ID from all entities
const findAuditEntry = (id: string) => {
  let foundEntry: (AuditEntry & { 
    entityName: string;
    entityDetails?: any;
  }) | null = null;
  
  // Check policies
  for (const policy of policies) {
    if (policy.auditTrail) {
      const entry = policy.auditTrail.find(e => e.id === id);
      if (entry) {
        foundEntry = {
          ...entry,
          entityName: `Policy #${policy.policyNumber}`,
          entityDetails: policy
        };
        break;
      }
    }
  }
  
  // Check policyholders
  if (!foundEntry) {
    for (const policyholder of policyHolders) {
      if (policyholder.auditTrail) {
        const entry = policyholder.auditTrail.find(e => e.id === id);
        if (entry) {
          foundEntry = {
            ...entry,
            entityName: `${policyholder.firstName} ${policyholder.lastName}`,
            entityDetails: policyholder
          };
          break;
        }
      }
    }
  }
  
  // Check benefits
  if (!foundEntry) {
    for (const benefit of benefits) {
      if (benefit.auditTrail) {
        const entry = benefit.auditTrail.find(e => e.id === id);
        if (entry) {
          foundEntry = {
            ...entry,
            entityName: benefit.name,
            entityDetails: benefit
          };
          break;
        }
      }
    }
  }
  
  return foundEntry;
};

export default function AuditTrailDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [auditEntry, setAuditEntry] = useState<(AuditEntry & { 
    entityName: string;
    entityDetails?: any;
  }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const entry = findAuditEntry(params.id);
      setAuditEntry(entry);
      setIsLoading(false);
    }, 800);
  }, [params.id]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };
  
  // Get icon for entity type
  const getEntityTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <DocumentTextIcon className="h-6 w-6" />;
      case 'policyholder':
        return <UserIcon className="h-6 w-6" />;
      case 'beneficiary':
        return <UserGroupIcon className="h-6 w-6" />;
      case 'benefit':
        return <ShieldCheckIcon className="h-6 w-6" />;
      default:
        return <DocumentTextIcon className="h-6 w-6" />;
    }
  };
  
  // Get color for action type
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-400 bg-green-900 bg-opacity-30';
      case 'update':
        return 'text-blue-400 bg-blue-900 bg-opacity-30';
      case 'delete':
        return 'text-red-400 bg-red-900 bg-opacity-30';
      default:
        return 'text-gray-400 bg-gray-800';
    }
  };
  
  // Copy JSON to clipboard
  const copyToClipboard = () => {
    if (auditEntry) {
      navigator.clipboard.writeText(JSON.stringify(auditEntry, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Export as JSON file
  const exportAsJson = () => {
    if (auditEntry) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditEntry, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `audit_entry_${auditEntry.id}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!auditEntry) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <button 
              onClick={() => router.push('/reports/audit-trails')}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-bold text-retro-light">Audit Entry Not Found</h1>
          </div>
          
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="text-gray-400">
              <p className="mb-4">The audit entry you&apos;re looking for could not be found.</p>
              <Link 
                href="/reports/audit-trails" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90"
              >
                Return to Audit Trails
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/reports/audit-trails')}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-retro-light">Audit Entry Details</h1>
                <span className="ml-3 px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  ID: {auditEntry.id.substring(0, 8)}...
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Detailed view of a single audit trail entry
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
            >
              <DocumentDuplicateIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={exportAsJson}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
                <h3 className="text-lg font-medium text-retro-light">Basic Information</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Action</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getActionColor(auditEntry.action)}`}>
                        {auditEntry.action.charAt(0).toUpperCase() + auditEntry.action.slice(1)}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Timestamp</dt>
                    <dd className="mt-1 flex items-center text-sm text-retro-light">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(auditEntry.timestamp)}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-400">User</dt>
                    <dd className="mt-1 flex items-center text-sm text-retro-light">
                      <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {auditEntry.userName}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Entity Type</dt>
                    <dd className="mt-1 flex items-center text-sm text-retro-light">
                      <div className={`p-1 rounded-md mr-2 ${
                        auditEntry.entityType === 'policy' ? 'bg-blue-900' :
                        auditEntry.entityType === 'policyholder' ? 'bg-green-900' :
                        auditEntry.entityType === 'beneficiary' ? 'bg-yellow-900' :
                        'bg-purple-900'
                      }`}>
                        {getEntityTypeIcon(auditEntry.entityType)}
                      </div>
                      <span className="capitalize">{auditEntry.entityType}</span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Entity Name</dt>
                    <dd className="mt-1 text-sm text-retro-light">
                      {auditEntry.entityName}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Entity ID</dt>
                    <dd className="mt-1 text-sm text-retro-light font-mono">
                      {auditEntry.entityId}
                    </dd>
                  </div>
                  
                  {auditEntry.notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-400">Notes</dt>
                      <dd className="mt-1 text-sm text-retro-light italic">
                        {auditEntry.notes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              
              {/* Entity Link */}
              <div className="px-4 py-4 sm:px-6 border-t border-gray-700 bg-gray-900">
                <Link
                  href={`/${auditEntry.entityType}s/${auditEntry.entityId}`}
                  className="inline-flex items-center text-sm font-medium text-retro-info hover:text-retro-primary"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  View {auditEntry.entityType} details
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Column - Changes */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
                <h3 className="text-lg font-medium text-retro-light">Changes</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Detailed record of all modifications made during this action
                </p>
              </div>
              
              {auditEntry.changes && auditEntry.changes.length > 0 ? (
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    {auditEntry.changes.map((change, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-gray-800 border-b border-gray-600">
                          <h4 className="text-md font-medium text-retro-light capitalize">
                            {change.field.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-900 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-400 mb-2">Previous Value</h5>
                              <div className="bg-gray-800 p-3 rounded border border-gray-700 min-h-[60px]">
                                {Array.isArray(change.oldValue) ? (
                                  change.oldValue.length > 0 ? (
                                    <ul className="list-disc pl-5 text-red-400">
                                      {change.oldValue.map((item, i) => (
                                        <li key={i} className="mb-1">{String(item)}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500 italic">(empty array)</span>
                                  )
                                ) : (
                                  change.oldValue !== undefined && change.oldValue !== null ? (
                                    <span className="text-red-400 break-words">{String(change.oldValue)}</span>
                                  ) : (
                                    <span className="text-gray-500 italic">(empty)</span>
                                  )
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-400 mb-2">New Value</h5>
                              <div className="bg-gray-800 p-3 rounded border border-gray-700 min-h-[60px]">
                                {Array.isArray(change.newValue) ? (
                                  change.newValue.length > 0 ? (
                                    <ul className="list-disc pl-5 text-green-400">
                                      {change.newValue.map((item, i) => (
                                        <li key={i} className="mb-1">{String(item)}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500 italic">(empty array)</span>
                                  )
                                ) : (
                                  change.newValue !== undefined && change.newValue !== null ? (
                                    <span className="text-green-400 break-words">{String(change.newValue)}</span>
                                  ) : (
                                    <span className="text-gray-500 italic">(empty)</span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-400">
                    {auditEntry.action === 'create' 
                      ? 'This is a creation event. No previous values exist.'
                      : auditEntry.action === 'delete'
                      ? 'This is a deletion event. No specific field changes were recorded.'
                      : 'No changes were recorded for this audit entry.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Raw JSON View */}
            <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-retro-light">Raw JSON Data</h3>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1 border border-gray-700 text-xs font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="px-4 py-5 sm:p-6 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono bg-gray-900 p-4 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                  {JSON.stringify(auditEntry, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
