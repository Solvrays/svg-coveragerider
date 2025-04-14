export interface PolicyHolder {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  address: Address;
  policies: string[];
  occupation?: string;
  employer?: string;
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated' | 'Domestic Partnership';
  taxId?: string;
  citizenship?: string;
  incomeRange?: string;
  riskClass?: 'Preferred Plus' | 'Preferred' | 'Standard Plus' | 'Standard' | 'Substandard';
  smokerStatus?: 'Non-smoker' | 'Smoker' | 'Former Smoker';
  height?: string;
  weight?: string;
  documents?: Document[];
  notes?: string;
  auditTrail?: AuditEntry[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Beneficiary {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  ssn: string;
  email?: string;
  phone?: string;
  address?: Address;
  percentage: number;
  policyId: string;
  auditTrail?: AuditEntry[];
}

export interface Policy {
  id: string;
  policyNumber: string;
  policyType: 'Term Life' | 'Whole Life' | 'Universal Life' | 'Variable Life' | 'Annuity' | 'Group Life';
  status: 'Active' | 'Pending' | 'Lapsed' | 'Cancelled' | 'Expired' | 'Paid Up';
  issueDate: string;
  effectiveDate: string;
  expiryDate?: string;
  premiumAmount: number;
  premiumFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Single';
  faceAmount: number;
  cashValue?: number;
  policyholderIds: string[];
  beneficiaryIds: string[];
  riders?: PolicyRider[];
  documents?: Document[];
  notes?: string;
  auditTrail?: AuditEntry[];
}

export interface PolicyRider {
  id: string;
  name: string;
  description: string;
  cost: number;
  status: 'Active' | 'Pending' | 'Cancelled';
  effectiveDate: string;
  expiryDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Application' | 'Policy' | 'Amendment' | 'Illustration' | 'Medical' | 'Correspondence' | 'Other';
  uploadDate: string;
  url: string;
  size: number; // in bytes
}

export interface PolicyFormData {
  policyNumber: string;
  policyType: string;
  status: string;
  issueDate: string;
  effectiveDate: string;
  expiryDate?: string;
  premiumAmount: number;
  premiumFrequency: string;
  faceAmount: number;
  cashValue?: number;
  notes?: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  type: 'Death Benefit' | 'Cash Value' | 'Living Benefit' | 'Rider' | 'Other';
  amount: number;
  policyId: string;
  effectiveDate?: string;
  expiryDate?: string;
  status?: 'Active' | 'Pending' | 'Expired' | 'Cancelled';
  conditions?: string[];
  exclusions?: string[];
  waitingPeriod?: number; // in days
  eliminationPeriod?: number; // in days
  maxBenefitPeriod?: string;
  benefitFrequency?: 'One-time' | 'Monthly' | 'Annual' | 'As incurred';
  coinsurance?: number; // percentage
  deductible?: number;
  maxLifetimeBenefit?: number;
  auditTrail?: AuditEntry[];
}

export interface PolicyholderFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  occupation?: string;
  employer?: string;
  gender?: string;
  maritalStatus?: string;
  taxId?: string;
  citizenship?: string;
  incomeRange?: string;
  riskClass?: string;
  smokerStatus?: string;
  height?: string;
  weight?: string;
  notes?: string;
}

export interface BenefitFormData {
  name: string;
  description: string;
  type: string;
  amount: number;
  policyId: string;
  effectiveDate?: string;
  expiryDate?: string;
  status?: string;
  conditions?: string[];
  exclusions?: string[];
  waitingPeriod?: number;
  eliminationPeriod?: number;
  maxBenefitPeriod?: string;
  benefitFrequency?: string;
  coinsurance?: number;
  deductible?: number;
  maxLifetimeBenefit?: number;
}

export interface PolicyBreakdown {
  policyId: string;
  premiumAllocation: {
    basePremium: number;
    riderPremiums: {
      riderName: string;
      amount: number;
    }[];
    fees: {
      feeName: string;
      amount: number;
    }[];
  };
  cashValueBreakdown?: {
    totalCashValue: number;
    guaranteedValue: number;
    nonGuaranteedValue: number;
    surrenderValue: number;
  };
  deathBenefitBreakdown?: {
    totalDeathBenefit: number;
    baseBenefit: number;
    additionalBenefits: {
      benefitName: string;
      amount: number;
    }[];
  };
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'viewer';
};

// Audit trail types
export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'beneficiary' | 'policy' | 'policyholder' | 'benefit';
  entityId: string;
  changes?: FieldChange[];
  notes?: string;
}

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

// Beneficiary management types
export interface BeneficiaryFormData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  ssn: string;
  email?: string;
  phone?: string;
  percentage: number;
  address?: Address;
}
