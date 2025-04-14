'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { AuditEntry } from '@/lib/types';
import { benefits, policyHolders, policies } from '@/lib/data/mock-data';

// Collect all audit trails from different entities
const collectAuditTrails = () => {
  const auditTrails: (AuditEntry & { entityName: string })[] = [];
  
  // Add policy audit trails
  policies.forEach(policy => {
    if (policy.auditTrail) {
      policy.auditTrail.forEach(entry => {
        auditTrails.push({
          ...entry,
          entityName: `Policy #${policy.policyNumber}`
        });
      });
    }
  });
  
  // Add policyholder audit trails
  policyHolders.forEach(policyholder => {
    if (policyholder.auditTrail) {
      policyholder.auditTrail.forEach(entry => {
        auditTrails.push({
          ...entry,
          entityName: `${policyholder.firstName} ${policyholder.lastName}`
        });
      });
    }
  });
  
  // Add benefit audit trails
  benefits.forEach(benefit => {
    if (benefit.auditTrail) {
      benefit.auditTrail.forEach(entry => {
        auditTrails.push({
          ...entry,
          entityName: benefit.name
        });
      });
    }
  });
  
  // Sort by timestamp (newest first)
  return auditTrails.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export default function AuditTrailsReportPage() {
  const router = useRouter();
  const [auditTrails, setAuditTrails] = useState<(AuditEntry & { entityName: string })[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<(AuditEntry & { entityName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    entityTypes: [] as string[],
    actions: [] as string[],
    dateRange: {
      start: '',
      end: ''
    },
    users: [] as string[]
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc' as 'asc' | 'desc'
  });
  
  // Load audit trails
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const trails = collectAuditTrails();
      setAuditTrails(trails);
      setFilteredTrails(trails);
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...auditTrails];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trail => 
        trail.entityName.toLowerCase().includes(query) ||
        trail.userName.toLowerCase().includes(query) ||
        trail.action.toLowerCase().includes(query) ||
        trail.entityType.toLowerCase().includes(query) ||
        (trail.notes && trail.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply entity type filters
    if (filters.entityTypes.length > 0) {
      result = result.filter(trail => filters.entityTypes.includes(trail.entityType));
    }
    
    // Apply action filters
    if (filters.actions.length > 0) {
      result = result.filter(trail => filters.actions.includes(trail.action));
    }
    
    // Apply date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      result = result.filter(trail => new Date(trail.timestamp) >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(trail => new Date(trail.timestamp) <= endDate);
    }
    
    // Apply user filters
    if (filters.users.length > 0) {
      result = result.filter(trail => filters.users.includes(trail.userName));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortConfig.key === 'timestamp') {
          return sortConfig.direction === 'asc' 
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        } else {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
    
    setFilteredTrails(result);
  }, [auditTrails, searchQuery, filters, sortConfig]);
  
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Toggle filter for entity types, actions, users
  const toggleFilter = (type: 'entityTypes' | 'actions' | 'users', value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[type]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      
      return {
        ...prev,
        [type]: currentValues
      };
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get icon for entity type
  const getEntityTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'policyholder':
        return <UserIcon className="h-5 w-5" />;
      case 'beneficiary':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'benefit':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };
  
  // Get color for action type
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-400';
      case 'update':
        return 'text-blue-400';
      case 'delete':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // Headers for CSV
    const headers = ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity Name', 'Entity ID', 'Notes'];
    
    // Convert data to CSV format
    const csvData = filteredTrails.map(trail => [
      trail.timestamp,
      trail.userName,
      trail.action,
      trail.entityType,
      trail.entityName,
      trail.entityId,
      trail.notes || ''
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_trail_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      entityTypes: [],
      actions: [],
      dateRange: {
        start: '',
        end: ''
      },
      users: []
    });
    setSearchQuery('');
  };
  
  // Get unique users for filter
  const uniqueUsers = [...new Set(auditTrails.map(trail => trail.userName))];
  
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/reports')}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-retro-light">Audit Trails Report</h1>
              <p className="mt-2 text-sm text-gray-400">
                Comprehensive history of all changes across the system
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-900 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-retro-primary focus:border-retro-primary sm:text-sm"
                placeholder="Search audit trails..."
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" aria-hidden="true" />
                </button>
              )}
            </div>
            
            <div className="mt-3 md:mt-0 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
              >
                <FunnelIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                Filters
                {(filters.entityTypes.length > 0 || filters.actions.length > 0 || filters.dateRange.start || filters.dateRange.end || filters.users.length > 0) && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-retro-primary text-white">
                    {filters.entityTypes.length + filters.actions.length + (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0) + filters.users.length}
                  </span>
                )}
              </button>
              
              {(filters.entityTypes.length > 0 || filters.actions.length > 0 || filters.dateRange.start || filters.dateRange.end || filters.users.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
              {/* Entity Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Entity Type</h3>
                <div className="space-y-2">
                  {['policy', 'policyholder', 'beneficiary', 'benefit'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`entity-${type}`}
                        type="checkbox"
                        className="h-4 w-4 text-retro-primary focus:ring-retro-primary border-gray-700 rounded bg-gray-900"
                        checked={filters.entityTypes.includes(type)}
                        onChange={() => toggleFilter('entityTypes', type)}
                      />
                      <label htmlFor={`entity-${type}`} className="ml-2 text-sm text-gray-300 capitalize">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Action</h3>
                <div className="space-y-2">
                  {['create', 'update', 'delete'].map((action) => (
                    <div key={action} className="flex items-center">
                      <input
                        id={`action-${action}`}
                        type="checkbox"
                        className="h-4 w-4 text-retro-primary focus:ring-retro-primary border-gray-700 rounded bg-gray-900"
                        checked={filters.actions.includes(action)}
                        onChange={() => toggleFilter('actions', action)}
                      />
                      <label htmlFor={`action-${action}`} className="ml-2 text-sm text-gray-300 capitalize">
                        {action}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Date Range</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="date-from" className="block text-xs text-gray-400">From</label>
                    <input
                      id="date-from"
                      type="date"
                      className="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-retro-primary focus:border-retro-primary sm:text-sm text-gray-300"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="date-to" className="block text-xs text-gray-400">To</label>
                    <input
                      id="date-to"
                      type="date"
                      className="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-retro-primary focus:border-retro-primary sm:text-sm text-gray-300"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              {/* User Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">User</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {uniqueUsers.map((user) => (
                    <div key={user} className="flex items-center">
                      <input
                        id={`user-${user}`}
                        type="checkbox"
                        className="h-4 w-4 text-retro-primary focus:ring-retro-primary border-gray-700 rounded bg-gray-900"
                        checked={filters.users.includes(user)}
                        onChange={() => toggleFilter('users', user)}
                      />
                      <label htmlFor={`user-${user}`} className="ml-2 text-sm text-gray-300">
                        {user}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Stats */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-retro-light">{filteredTrails.length}</span> of <span className="font-medium text-retro-light">{auditTrails.length}</span> audit trail entries
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
            Sort by: 
            <button 
              className="ml-2 px-2 py-1 rounded hover:bg-gray-700 flex items-center"
              onClick={() => handleSort('timestamp')}
            >
              <span className={sortConfig.key === 'timestamp' ? 'text-retro-light' : ''}>Date</span>
              {sortConfig.key === 'timestamp' && (
                sortConfig.direction === 'asc' 
                  ? <ChevronUpIcon className="h-4 w-4 ml-1 text-retro-light" />
                  : <ChevronDownIcon className="h-4 w-4 ml-1 text-retro-light" />
              )}
            </button>
            <button 
              className="ml-2 px-2 py-1 rounded hover:bg-gray-700 flex items-center"
              onClick={() => handleSort('entityType')}
            >
              <span className={sortConfig.key === 'entityType' ? 'text-retro-light' : ''}>Type</span>
              {sortConfig.key === 'entityType' && (
                sortConfig.direction === 'asc' 
                  ? <ChevronUpIcon className="h-4 w-4 ml-1 text-retro-light" />
                  : <ChevronDownIcon className="h-4 w-4 ml-1 text-retro-light" />
              )}
            </button>
            <button 
              className="ml-2 px-2 py-1 rounded hover:bg-gray-700 flex items-center"
              onClick={() => handleSort('action')}
            >
              <span className={sortConfig.key === 'action' ? 'text-retro-light' : ''}>Action</span>
              {sortConfig.key === 'action' && (
                sortConfig.direction === 'asc' 
                  ? <ChevronUpIcon className="h-4 w-4 ml-1 text-retro-light" />
                  : <ChevronDownIcon className="h-4 w-4 ml-1 text-retro-light" />
              )}
            </button>
          </div>
        </div>
        
        {/* Audit Trail List */}
        {isLoading ? (
          <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-700 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2.5"></div>
              <div className="h-2 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ) : filteredTrails.length === 0 ? (
          <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="text-gray-400">
              No audit trail entries found matching your criteria.
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredTrails.map((trail) => (
              <div key={trail.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${
                        trail.entityType === 'policy' ? 'bg-blue-900' :
                        trail.entityType === 'policyholder' ? 'bg-green-900' :
                        trail.entityType === 'beneficiary' ? 'bg-yellow-900' :
                        'bg-purple-900'
                      }`}>
                        {getEntityTypeIcon(trail.entityType)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className={`font-medium capitalize ${getActionColor(trail.action)}`}>
                            {trail.action}
                          </span>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-sm text-gray-300 capitalize">{trail.entityType}</span>
                        </div>
                        <div className="mt-1 text-lg font-medium text-retro-light">{trail.entityName}</div>
                        <div className="mt-1 flex items-center text-sm text-gray-400">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDate(trail.timestamp)}
                          <span className="mx-2">|</span>
                          <UserIcon className="h-4 w-4 mr-1" />
                          {trail.userName}
                        </div>
                      </div>
                    </div>
                    <Link href={`/reports/audit-trails/${trail.id}`} className="text-retro-info hover:text-retro-primary text-sm">
                      View Details
                    </Link>
                  </div>
                  
                  {trail.notes && (
                    <div className="mt-3 text-sm text-gray-400 border-t border-gray-700 pt-3">
                      <p className="italic">{trail.notes}</p>
                    </div>
                  )}
                  
                  {trail.changes && trail.changes.length > 0 && (
                    <div className="mt-3 border-t border-gray-700 pt-3">
                      <div className="text-xs text-gray-400 mb-2">Changes:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {trail.changes.slice(0, 2).map((change, idx) => (
                          <div key={idx} className="bg-gray-700 p-2 rounded text-xs">
                            <div className="font-medium text-gray-300 mb-1">{change.field}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-400">From:</span>
                                <div className="text-red-400">
                                  {change.oldValue !== undefined && change.oldValue !== null
                                    ? String(change.oldValue)
                                    : '(empty)'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">To:</span>
                                <div className="text-green-400">
                                  {change.newValue !== undefined && change.newValue !== null
                                    ? String(change.newValue)
                                    : '(empty)'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {trail.changes.length > 2 && (
                        <div className="mt-2 text-center">
                          <Link href={`/reports/audit-trails/${trail.id}`} className="text-xs text-retro-info hover:text-retro-primary">
                            View {trail.changes.length - 2} more changes
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
