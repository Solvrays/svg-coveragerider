'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  TableCellsIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getReportById } from '@/lib/data/mock-reports';
import { Report, Visualization } from '@/lib/types/reports';

// Chart components
const BarChart = ({ data, config }: { data: any[], config: Visualization['config'] }) => {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex">
          {data.map((item: any, index: number) => {
            const value = item[config.series?.[0].dataKey || 'value'];
            const maxValue = Math.max(...data.map((d: any) => d[config.series?.[0].dataKey || 'value']));
            const percentage = (value / maxValue) * 100;
            const color = config.series?.[0].color || '#60a5fa';
            
            return (
              <div key={index} className="flex flex-col justify-end items-center mx-1 flex-1">
                <div 
                  className="w-full rounded-t-sm transition-all duration-500 ease-in-out" 
                  style={{ 
                    height: `${percentage}%`, 
                    backgroundColor: color,
                    animation: 'grow-up 1s ease-out'
                  }}
                ></div>
                <div className="text-xs text-gray-400 mt-1 truncate w-full text-center">
                  {item[config.xAxis?.dataKey || 'name']}
                </div>
              </div>
            );
          })}
        </div>
        {config.xAxis?.title && (
          <div className="text-xs text-gray-500 text-center mt-2">{config.xAxis.title}</div>
        )}
      </div>
    </div>
  );
};

const LineChart = ({ data, config }: { data: any[], config: Visualization['config'] }) => {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative">
          <svg className="w-full h-full">
            <path
              d={data.map((point: any, index: number) => {
                const x = (index / (data.length - 1)) * 100;
                const maxValue = Math.max(...data.map((d: any) => d[config.series?.[0].dataKey || 'value']));
                const y = 100 - ((point[config.series?.[0].dataKey || 'value'] / maxValue) * 100);
                return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ')}
              fill="none"
              stroke={config.series?.[0].color || '#60a5fa'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-1000 ease-in-out"
              style={{ strokeDasharray: '1000', strokeDashoffset: '1000', animation: 'dash 2s ease-out forwards' }}
            />
            {data.map((point: any, index: number) => {
              const x = (index / (data.length - 1)) * 100;
              const maxValue = Math.max(...data.map((d: any) => d[config.series?.[0].dataKey || 'value']));
              const y = 100 - ((point[config.series?.[0].dataKey || 'value'] / maxValue) * 100);
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={config.series?.[0].color || '#60a5fa'}
                  className="transition-all duration-1000 ease-in-out"
                  style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${index * 0.1}s forwards` }}
                />
              );
            })}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {data.map((item: any, index: number) => (
            <div key={index} className="truncate">
              {item[config.xAxis?.dataKey || 'name']}
            </div>
          ))}
        </div>
        {config.xAxis?.title && (
          <div className="text-xs text-gray-500 text-center mt-2">{config.xAxis.title}</div>
        )}
      </div>
    </div>
  );
};

const PieChart = ({ data, config }: { data: any[], config: Visualization['config'] }) => {
  const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((item: any, index: number) => {
            const percentage = (item.value / total) * 100;
            const startAngle = cumulativePercentage * 3.6; // 3.6 degrees per percentage point
            cumulativePercentage += percentage;
            const endAngle = cumulativePercentage * 3.6;
            
            // Convert angles to radians and calculate path
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const color = config.colors?.[index % (config.colors.length || 1)] || '#60a5fa';
            
            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="#1f2937"
                strokeWidth="1"
                className="transition-all duration-500 ease-in-out"
                style={{ 
                  transformOrigin: 'center',
                  animation: `fade-in 0.5s ease-out ${index * 0.1}s forwards, 
                             grow-from-center 0.5s ease-out ${index * 0.1}s forwards`
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {config.showLegend && (
        <div className="ml-6 space-y-2">
          {data.map((item: any, index: number) => {
            const color = config.colors?.[index % (config.colors.length || 1)] || '#60a5fa';
            return (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: color }}></div>
                <span className="text-xs text-gray-300">{item.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DataTable = ({ data, columns }: { data: any[], columns: { key: string, label: string }[] }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                  >
                    {typeof row[column.key] === 'object' 
                      ? JSON.stringify(row[column.key]) 
                      : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to get appropriate data for a visualization
const getVisualizationData = (report: Report, vizId: string) => {
  const viz = report.visualizations.find(v => v.id === vizId);
  if (!viz) return [];
  
  switch (report.type) {
    case 'audit-trail':
      if (viz.type === 'pie') {
        return [
          { name: 'Create', value: report.data.summary.byAction.create },
          { name: 'Update', value: report.data.summary.byAction.update },
          { name: 'Delete', value: report.data.summary.byAction.delete }
        ];
      } else if (viz.type === 'line') {
        return report.data.summary.byDate;
      } else if (viz.type === 'bar') {
        return [
          { entityType: 'Policy', count: report.data.summary.byEntityType.policy },
          { entityType: 'Policyholder', count: report.data.summary.byEntityType.policyholder },
          { entityType: 'Beneficiary', count: report.data.summary.byEntityType.beneficiary },
          { entityType: 'Benefit', count: report.data.summary.byEntityType.benefit }
        ];
      }
      break;
    case 'policy-activity':
      if (viz.type === 'pie') {
        return report.data.summary.byType.map(item => ({ 
          name: item.type, 
          value: item.count 
        }));
      } else if (viz.type === 'line') {
        return report.data.summary.byMonth;
      } else if (viz.type === 'bar') {
        return report.data.summary.byStatus;
      }
      break;
    case 'benefit-utilization':
      if (viz.type === 'pie') {
        return report.data.summary.byType.map(item => ({ 
          name: item.type, 
          value: item.count 
        }));
      } else if (viz.type === 'bar') {
        return report.data.summary.byType;
      }
      break;
    case 'user-activity':
      if (viz.type === 'bar') {
        return report.data.summary.byUser;
      } else if (viz.type === 'line') {
        return report.data.summary.byHour;
      } else if (viz.type === 'pie') {
        return report.data.summary.byAction.map(item => ({ 
          name: item.action, 
          value: item.count 
        }));
      }
      break;
  }
  
  return [];
};

// Helper function to get table data and columns for a report
const getReportTableData = (report: Report) => {
  switch (report.type) {
    case 'audit-trail':
      return {
        data: report.data.auditEntries,
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'timestamp', label: 'Timestamp' },
          { key: 'userName', label: 'User' },
          { key: 'action', label: 'Action' },
          { key: 'entityType', label: 'Entity Type' },
          { key: 'entityId', label: 'Entity ID' }
        ]
      };
    case 'policy-activity':
      return {
        data: report.data.policies,
        columns: [
          { key: 'policyNumber', label: 'Policy Number' },
          { key: 'policyType', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'issueDate', label: 'Issue Date' },
          { key: 'premiumAmount', label: 'Premium' },
          { key: 'faceAmount', label: 'Face Amount' }
        ]
      };
    case 'benefit-utilization':
      return {
        data: report.data.benefits,
        columns: [
          { key: 'name', label: 'Benefit Name' },
          { key: 'type', label: 'Type' },
          { key: 'amount', label: 'Amount' },
          { key: 'policyId', label: 'Policy ID' },
          { key: 'status', label: 'Status' }
        ]
      };
    case 'user-activity':
      return {
        data: report.data.activities,
        columns: [
          { key: 'userName', label: 'User' },
          { key: 'action', label: 'Action' },
          { key: 'entityType', label: 'Entity Type' },
          { key: 'timestamp', label: 'Timestamp' }
        ]
      };
    default:
      return { data: [], columns: [] };
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Client component that handles the report view UI
export default function ReportViewClient({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visualizations' | 'data'>('visualizations');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundReport = getReportById(reportId);
      setReport(foundReport || null);
      setIsLoading(false);
    }, 800);
  }, [reportId]);
  
  // Export report data
  const exportReport = () => {
    if (!report) return;
    
    if (exportFormat === 'csv') {
      const { data, columns } = getReportTableData(report);
      const headers = columns.map(col => col.label).join(',');
      const rows = data.map((row: any) => 
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      ).join('\n');
      
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // In a real app, PDF and Excel exports would be implemented
      alert(`${exportFormat.toUpperCase()} export would be implemented in a real application`);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-800 rounded-lg border border-gray-700"></div>
              <div className="h-64 bg-gray-800 rounded-lg border border-gray-700"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!report) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <button 
              onClick={() => router.push('/reports')}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              aria-label="Back to reports"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-bold text-retro-light">Report Not Found</h1>
          </div>
          
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="text-gray-400">
              <p className="mb-4">The report you&apos;re looking for could not be found.</p>
              <Link 
                href="/reports" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90"
              >
                Return to Reports
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const { data, columns } = getReportTableData(report);
  
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/reports')}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              aria-label="Back to reports"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-retro-light">{report.name}</h1>
              <p className="mt-1 text-sm text-gray-400">
                {report.description}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
                  onClick={() => {
                    const select = document.getElementById('exportFormat');
                    if (select) select.click();
                  }}
                  aria-label="Export report"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Export as {exportFormat.toUpperCase()}
                  <select
                    id="exportFormat"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Select export format"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                  </select>
                </button>
              </div>
            </div>
            
            <button
              onClick={exportReport}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-retro-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-retro-primary"
              aria-label="Download report"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Download
            </button>
          </div>
        </div>
        
        {/* Report Metadata */}
        <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-retro-light">{formatDate(report.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="text-sm text-retro-light">{report.createdBy.name}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ArrowPathIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Last Run</p>
                <p className="text-sm text-retro-light">{report.lastRun ? formatDate(report.lastRun) : 'Never'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Date Range</p>
                <p className="text-sm text-retro-light">
                  {report.parameters.dateRange 
                    ? `${new Date(report.parameters.dateRange.start).toLocaleDateString()} - ${new Date(report.parameters.dateRange.end).toLocaleDateString()}`
                    : 'All Time'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('visualizations')}
              className={`${
                activeTab === 'visualizations'
                  ? 'border-retro-primary text-retro-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              aria-label="View visualizations"
            >
              <ChartBarIcon className="h-5 w-5 inline-block mr-2" />
              Visualizations
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`${
                activeTab === 'data'
                  ? 'border-retro-primary text-retro-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              aria-label="View raw data"
            >
              <TableCellsIcon className="h-5 w-5 inline-block mr-2" />
              Raw Data
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="mt-6">
          {activeTab === 'visualizations' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.visualizations.map((viz) => {
                const vizData = getVisualizationData(report, viz.id);
                
                return (
                  <div key={viz.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
                      <h3 className="text-lg font-medium text-retro-light">{viz.title}</h3>
                      {viz.description && (
                        <p className="mt-1 text-sm text-gray-400">{viz.description}</p>
                      )}
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {viz.type === 'bar' && (
                        <BarChart data={vizData} config={viz.config} />
                      )}
                      {viz.type === 'line' && (
                        <LineChart data={vizData} config={viz.config} />
                      )}
                      {viz.type === 'pie' && (
                        <PieChart data={vizData} config={viz.config} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
                <h3 className="text-lg font-medium text-retro-light">Raw Data</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Complete dataset used for this report
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <DataTable data={data} columns={columns} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes grow-up {
          from { height: 0; }
          to { height: var(--height); }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes grow-from-center {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </DashboardLayout>
  );
}
