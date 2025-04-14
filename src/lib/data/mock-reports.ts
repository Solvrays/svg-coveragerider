import { 
  Report, 
  AuditTrailReport, 
  PolicyActivityReport, 
  BenefitUtilizationReport, 
  UserActivityReport 
} from '../types/reports';
import { auditEntries } from './mock-data';

// Helper function to generate dates in the past
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Helper function to generate dates in the future
const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Sample Audit Trail Report
export const auditTrailReport: AuditTrailReport = {
  id: 'report-001',
  name: 'Monthly Audit Trail Analysis',
  description: 'Comprehensive analysis of all system changes in the past 30 days',
  type: 'audit-trail',
  createdAt: daysAgo(2),
  createdBy: {
    id: 'user-001',
    name: 'Admin User'
  },
  status: 'completed',
  lastRun: daysAgo(2),
  parameters: {
    dateRange: {
      start: daysAgo(30),
      end: daysAgo(0)
    },
    filters: {
      entityTypes: ['policy', 'policyholder', 'beneficiary', 'benefit'],
      actions: ['create', 'update', 'delete']
    }
  },
  visualizations: [
    {
      id: 'viz-001',
      title: 'Audit Actions by Type',
      description: 'Distribution of audit actions across different types',
      type: 'pie',
      config: {
        colors: ['#4ade80', '#60a5fa', '#f87171'],
        labels: ['Create', 'Update', 'Delete'],
        showLegend: true
      }
    },
    {
      id: 'viz-002',
      title: 'Audit Activity Timeline',
      description: 'Audit actions over time',
      type: 'line',
      config: {
        xAxis: {
          title: 'Date',
          dataKey: 'date'
        },
        yAxis: {
          title: 'Number of Actions',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Create',
            dataKey: 'create',
            color: '#4ade80'
          },
          {
            name: 'Update',
            dataKey: 'update',
            color: '#60a5fa'
          },
          {
            name: 'Delete',
            dataKey: 'delete',
            color: '#f87171'
          }
        ],
        showLegend: true
      }
    },
    {
      id: 'viz-003',
      title: 'Actions by Entity Type',
      description: 'Distribution of actions across different entity types',
      type: 'bar',
      config: {
        xAxis: {
          title: 'Entity Type',
          dataKey: 'entityType'
        },
        yAxis: {
          title: 'Number of Actions',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Count',
            dataKey: 'count',
            color: '#8b5cf6'
          }
        ],
        showLegend: false,
        stacked: false
      }
    }
  ],
  data: {
    auditEntries: auditEntries,
    summary: {
      totalEntries: auditEntries.length,
      byAction: {
        create: auditEntries.filter(entry => entry.action === 'create').length,
        update: auditEntries.filter(entry => entry.action === 'update').length,
        delete: auditEntries.filter(entry => entry.action === 'delete').length
      },
      byEntityType: {
        policy: auditEntries.filter(entry => entry.entityType === 'policy').length,
        policyholder: auditEntries.filter(entry => entry.entityType === 'policyholder').length,
        beneficiary: auditEntries.filter(entry => entry.entityType === 'beneficiary').length,
        benefit: auditEntries.filter(entry => entry.entityType === 'benefit').length
      },
      byUser: [
        {
          userId: 'user-001',
          userName: 'Admin User',
          count: auditEntries.filter(entry => entry.userId === 'user-001').length
        },
        {
          userId: 'user-002',
          userName: 'Agent Smith',
          count: auditEntries.filter(entry => entry.userId === 'user-002').length
        }
      ],
      byDate: [
        { date: '2025-04-01', count: 3 },
        { date: '2025-04-02', count: 1 },
        { date: '2025-04-03', count: 0 },
        { date: '2025-04-04', count: 2 },
        { date: '2025-04-05', count: 0 },
        { date: '2025-04-06', count: 0 },
        { date: '2025-04-07', count: 1 },
        { date: '2025-04-08', count: 0 },
        { date: '2025-04-09', count: 0 },
        { date: '2025-04-10', count: 3 },
        { date: '2025-04-11', count: 1 },
        { date: '2025-04-12', count: 0 },
        { date: '2025-04-13', count: 0 },
        { date: '2025-04-14', count: 1 }
      ]
    }
  }
};

// Sample Policy Activity Report
export const policyActivityReport: PolicyActivityReport = {
  id: 'report-002',
  name: 'Quarterly Policy Activity',
  description: 'Analysis of policy creation, updates, and status changes in Q1 2025',
  type: 'policy-activity',
  createdAt: daysAgo(5),
  createdBy: {
    id: 'user-002',
    name: 'Agent Smith'
  },
  status: 'completed',
  lastRun: daysAgo(5),
  parameters: {
    dateRange: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-03-31T23:59:59Z'
    },
    filters: {
      policyTypes: ['Term Life', 'Whole Life', 'Universal Life']
    }
  },
  visualizations: [
    {
      id: 'viz-004',
      title: 'Policies by Type',
      description: 'Distribution of policies across different types',
      type: 'pie',
      config: {
        colors: ['#4ade80', '#60a5fa', '#f87171', '#facc15', '#a78bfa'],
        showLegend: true
      }
    },
    {
      id: 'viz-005',
      title: 'Policy Issuance Trend',
      description: 'Number of policies issued over time',
      type: 'line',
      config: {
        xAxis: {
          title: 'Month',
          dataKey: 'month'
        },
        yAxis: {
          title: 'Number of Policies',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Policies Issued',
            dataKey: 'count',
            color: '#60a5fa'
          }
        ],
        showLegend: false
      }
    },
    {
      id: 'viz-006',
      title: 'Policies by Status',
      description: 'Current status distribution of all policies',
      type: 'bar',
      config: {
        xAxis: {
          title: 'Status',
          dataKey: 'status'
        },
        yAxis: {
          title: 'Number of Policies',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Count',
            dataKey: 'count',
            color: '#8b5cf6'
          }
        ],
        showLegend: false
      }
    }
  ],
  data: {
    policies: [
      {
        id: 'pol-001',
        policyNumber: 'LFP-12345678',
        policyType: 'Whole Life',
        status: 'Active',
        issueDate: '2025-01-15',
        premiumAmount: 250.00,
        faceAmount: 500000
      },
      {
        id: 'pol-002',
        policyNumber: 'LFP-23456789',
        policyType: 'Term Life',
        status: 'Active',
        issueDate: '2025-02-10',
        premiumAmount: 125.00,
        faceAmount: 250000
      },
      {
        id: 'pol-003',
        policyNumber: 'LFP-34567890',
        policyType: 'Universal Life',
        status: 'Active',
        issueDate: '2025-03-05',
        premiumAmount: 350.00,
        faceAmount: 750000
      }
    ],
    summary: {
      totalPolicies: 3,
      byStatus: [
        { status: 'Active', count: 3 },
        { status: 'Pending', count: 0 },
        { status: 'Lapsed', count: 0 },
        { status: 'Cancelled', count: 0 }
      ],
      byType: [
        { type: 'Whole Life', count: 1 },
        { type: 'Term Life', count: 1 },
        { type: 'Universal Life', count: 1 }
      ],
      premiumTotal: 725.00,
      faceAmountTotal: 1500000,
      byMonth: [
        { month: 'Jan 2025', count: 1 },
        { month: 'Feb 2025', count: 1 },
        { month: 'Mar 2025', count: 1 }
      ]
    }
  }
};

// Sample Benefit Utilization Report
export const benefitUtilizationReport: BenefitUtilizationReport = {
  id: 'report-003',
  name: 'Benefit Utilization Analysis',
  description: 'Detailed analysis of benefit types, amounts, and utilization patterns',
  type: 'benefit-utilization',
  createdAt: daysAgo(7),
  createdBy: {
    id: 'user-001',
    name: 'Admin User'
  },
  status: 'completed',
  lastRun: daysAgo(7),
  parameters: {
    dateRange: {
      start: daysAgo(90),
      end: daysAgo(0)
    },
    filters: {
      benefitTypes: ['Death Benefit', 'Living Benefit', 'Rider']
    }
  },
  visualizations: [
    {
      id: 'viz-007',
      title: 'Benefits by Type',
      description: 'Distribution of benefits across different types',
      type: 'pie',
      config: {
        colors: ['#4ade80', '#60a5fa', '#f87171', '#facc15'],
        showLegend: true
      }
    },
    {
      id: 'viz-008',
      title: 'Benefit Amounts by Type',
      description: 'Total benefit amounts by type',
      type: 'bar',
      config: {
        xAxis: {
          title: 'Benefit Type',
          dataKey: 'type'
        },
        yAxis: {
          title: 'Total Amount ($)',
          dataKey: 'totalAmount'
        },
        series: [
          {
            name: 'Amount',
            dataKey: 'totalAmount',
            color: '#60a5fa'
          }
        ],
        showLegend: false
      }
    }
  ],
  data: {
    benefits: [
      {
        id: 'ben-001',
        name: 'Standard Death Benefit',
        type: 'Death Benefit',
        amount: 500000,
        policyId: 'pol-001',
        status: 'Active'
      },
      {
        id: 'ben-002',
        name: 'Accelerated Death Benefit',
        type: 'Living Benefit',
        amount: 100000,
        policyId: 'pol-001',
        status: 'Active'
      },
      {
        id: 'ben-003',
        name: 'Accidental Death Benefit',
        type: 'Rider',
        amount: 250000,
        policyId: 'pol-002',
        status: 'Active'
      }
    ],
    summary: {
      totalBenefits: 3,
      byType: [
        { type: 'Death Benefit', count: 1, totalAmount: 500000 },
        { type: 'Living Benefit', count: 1, totalAmount: 100000 },
        { type: 'Rider', count: 1, totalAmount: 250000 }
      ],
      byStatus: [
        { status: 'Active', count: 3 },
        { status: 'Pending', count: 0 },
        { status: 'Expired', count: 0 }
      ],
      totalAmount: 850000,
      averageAmount: 283333.33
    }
  }
};

// Sample User Activity Report
export const userActivityReport: UserActivityReport = {
  id: 'report-004',
  name: 'User Activity Monitoring',
  description: 'Analysis of user actions, login patterns, and system usage',
  type: 'user-activity',
  createdAt: daysAgo(3),
  createdBy: {
    id: 'user-001',
    name: 'Admin User'
  },
  status: 'completed',
  lastRun: daysAgo(3),
  parameters: {
    dateRange: {
      start: daysAgo(14),
      end: daysAgo(0)
    }
  },
  visualizations: [
    {
      id: 'viz-009',
      title: 'Actions by User',
      description: 'Number of actions performed by each user',
      type: 'bar',
      config: {
        xAxis: {
          title: 'User',
          dataKey: 'userName'
        },
        yAxis: {
          title: 'Number of Actions',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Actions',
            dataKey: 'count',
            color: '#8b5cf6'
          }
        ],
        showLegend: false
      }
    },
    {
      id: 'viz-010',
      title: 'Activity by Hour of Day',
      description: 'Distribution of user activity across hours of the day',
      type: 'line',
      config: {
        xAxis: {
          title: 'Hour',
          dataKey: 'hour'
        },
        yAxis: {
          title: 'Number of Actions',
          dataKey: 'count'
        },
        series: [
          {
            name: 'Actions',
            dataKey: 'count',
            color: '#60a5fa'
          }
        ],
        showLegend: false
      }
    },
    {
      id: 'viz-011',
      title: 'Actions by Type',
      description: 'Distribution of different action types',
      type: 'pie',
      config: {
        colors: ['#4ade80', '#60a5fa', '#f87171'],
        showLegend: true
      }
    }
  ],
  data: {
    activities: [
      {
        userId: 'user-001',
        userName: 'Admin User',
        action: 'login',
        entityType: 'system',
        timestamp: daysAgo(7)
      },
      {
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'policy',
        timestamp: daysAgo(7)
      },
      {
        userId: 'user-002',
        userName: 'Agent Smith',
        action: 'login',
        entityType: 'system',
        timestamp: daysAgo(6)
      },
      {
        userId: 'user-002',
        userName: 'Agent Smith',
        action: 'update',
        entityType: 'policyholder',
        timestamp: daysAgo(6)
      },
      {
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'beneficiary',
        timestamp: daysAgo(5)
      },
      {
        userId: 'user-003',
        userName: 'Viewer User',
        action: 'login',
        entityType: 'system',
        timestamp: daysAgo(4)
      },
      {
        userId: 'user-003',
        userName: 'Viewer User',
        action: 'view',
        entityType: 'report',
        timestamp: daysAgo(4)
      },
      {
        userId: 'user-002',
        userName: 'Agent Smith',
        action: 'update',
        entityType: 'policy',
        timestamp: daysAgo(3)
      },
      {
        userId: 'user-001',
        userName: 'Admin User',
        action: 'delete',
        entityType: 'beneficiary',
        timestamp: daysAgo(2)
      },
      {
        userId: 'user-001',
        userName: 'Admin User',
        action: 'create',
        entityType: 'report',
        timestamp: daysAgo(1)
      }
    ],
    summary: {
      totalActivities: 10,
      byUser: [
        { userId: 'user-001', userName: 'Admin User', count: 5 },
        { userId: 'user-002', userName: 'Agent Smith', count: 3 },
        { userId: 'user-003', userName: 'Viewer User', count: 2 }
      ],
      byAction: [
        { action: 'login', count: 3 },
        { action: 'create', count: 3 },
        { action: 'update', count: 2 },
        { action: 'view', count: 1 },
        { action: 'delete', count: 1 }
      ],
      byEntityType: [
        { entityType: 'system', count: 3 },
        { entityType: 'policy', count: 2 },
        { entityType: 'policyholder', count: 1 },
        { entityType: 'beneficiary', count: 2 },
        { entityType: 'report', count: 2 }
      ],
      byHour: [
        { hour: 8, count: 1 },
        { hour: 9, count: 2 },
        { hour: 10, count: 3 },
        { hour: 11, count: 1 },
        { hour: 13, count: 0 },
        { hour: 14, count: 2 },
        { hour: 15, count: 1 },
        { hour: 16, count: 0 }
      ],
      byDay: [
        { day: daysAgo(7).split('T')[0], count: 2 },
        { day: daysAgo(6).split('T')[0], count: 2 },
        { day: daysAgo(5).split('T')[0], count: 1 },
        { day: daysAgo(4).split('T')[0], count: 2 },
        { day: daysAgo(3).split('T')[0], count: 1 },
        { day: daysAgo(2).split('T')[0], count: 1 },
        { day: daysAgo(1).split('T')[0], count: 1 }
      ]
    }
  }
};

// Export all reports in a collection
export const reports: Report[] = [
  auditTrailReport,
  policyActivityReport,
  benefitUtilizationReport,
  userActivityReport
];

// Function to find a report by ID
export const getReportById = (id: string): Report | undefined => {
  return reports.find(report => report.id === id);
};
