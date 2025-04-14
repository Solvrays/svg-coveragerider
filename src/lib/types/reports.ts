// Report types for the policy management system
import { AuditEntry } from './index';

export type ReportType = 
  | 'audit-trail' 
  | 'policy-activity' 
  | 'benefit-utilization' 
  | 'user-activity' 
  | 'custom';

export type ReportStatus = 'completed' | 'scheduled' | 'processing' | 'error';

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'timeline' 
  | 'heatmap' 
  | 'table';

export interface Report {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  status: ReportStatus;
  lastRun?: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRun: string;
  };
  parameters: {
    dateRange?: {
      start: string;
      end: string;
    };
    filters?: Record<string, any>;
  };
  visualizations: Visualization[];
  data: any;
}

export interface Visualization {
  id: string;
  title: string;
  description?: string;
  type: ChartType;
  config: {
    xAxis?: {
      title?: string;
      dataKey: string;
    };
    yAxis?: {
      title?: string;
      dataKey: string;
    };
    series?: {
      name: string;
      dataKey: string;
      color?: string;
    }[];
    colors?: string[];
    labels?: string[];
    showLegend?: boolean;
    stacked?: boolean;
  };
}

export interface AuditTrailReport extends Report {
  type: 'audit-trail';
  data: {
    auditEntries: AuditEntry[];
    summary: {
      totalEntries: number;
      byAction: {
        create: number;
        update: number;
        delete: number;
      };
      byEntityType: {
        policy: number;
        policyholder: number;
        beneficiary: number;
        benefit: number;
      };
      byUser: {
        userId: string;
        userName: string;
        count: number;
      }[];
      byDate: {
        date: string;
        count: number;
      }[];
    };
  };
}

export interface PolicyActivityReport extends Report {
  type: 'policy-activity';
  data: {
    policies: {
      id: string;
      policyNumber: string;
      policyType: string;
      status: string;
      issueDate: string;
      premiumAmount: number;
      faceAmount: number;
    }[];
    summary: {
      totalPolicies: number;
      byStatus: {
        status: string;
        count: number;
      }[];
      byType: {
        type: string;
        count: number;
      }[];
      premiumTotal: number;
      faceAmountTotal: number;
      byMonth: {
        month: string;
        count: number;
      }[];
    };
  };
}

export interface BenefitUtilizationReport extends Report {
  type: 'benefit-utilization';
  data: {
    benefits: {
      id: string;
      name: string;
      type: string;
      amount: number;
      policyId: string;
      status: string;
    }[];
    summary: {
      totalBenefits: number;
      byType: {
        type: string;
        count: number;
        totalAmount: number;
      }[];
      byStatus: {
        status: string;
        count: number;
      }[];
      totalAmount: number;
      averageAmount: number;
    };
  };
}

export interface UserActivityReport extends Report {
  type: 'user-activity';
  data: {
    activities: {
      userId: string;
      userName: string;
      action: string;
      entityType: string;
      timestamp: string;
    }[];
    summary: {
      totalActivities: number;
      byUser: {
        userId: string;
        userName: string;
        count: number;
      }[];
      byAction: {
        action: string;
        count: number;
      }[];
      byEntityType: {
        entityType: string;
        count: number;
      }[];
      byHour: {
        hour: number;
        count: number;
      }[];
      byDay: {
        day: string;
        count: number;
      }[];
    };
  };
}
