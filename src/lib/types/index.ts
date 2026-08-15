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

export type BeneficiaryType = 'Primary' | 'Contingent';

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
  beneficiaryType?: BeneficiaryType;
  perStirpes?: boolean;
  auditTrail?: AuditEntry[];
}

export type PolicyType =
  | 'Term Life'
  | 'Whole Life'
  | 'Universal Life'
  | 'Variable Life'
  | 'Annuity'
  | 'Group Life'
  | 'Preneed';

export type PolicyStatus =
  | 'Active'
  | 'Pending'
  | 'Lapsed'
  | 'Cancelled'
  | 'Expired'
  | 'Paid Up'
  | 'Free Look'
  | 'NSF'
  | 'Surrendered'
  | 'Trust Refund'
  | 'Annuitized';

export type PremiumFrequency = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Single';

/**
 * Producer / compensation attributes.
 *
 * A policy cannot drive commission without knowing who wrote it, on what
 * product, and how the case is split. These are optional so every existing
 * policy record stays valid, but they are what an external compensation model
 * (carrier Excel workbook, TPA calc engine, etc.) needs as inputs.
 */
export interface PolicyCompensationFields {
  /** Writing agent as the carrier's compensation model identifies them. */
  writingAgentId?: string;
  writingAgentName?: string;
  /** Product code understood by the carrier's comp model (e.g. TL20, PN-5, FIA). */
  productCode?: string;
  /** Line of business: Life | Preneed | Annuity. */
  productLine?: 'Life' | 'Preneed' | 'Annuity';
  carrier?: string;
  /** Share of commission credited to the writing agent (0-1). */
  agentSplit?: number;
  /** Single premium or annuity deposit amount. */
  depositAmount?: number;
  /** Target premium (UL/IUL) or preneed contract amount. */
  contractAmount?: number;
  fundingSource?: string;
  /** Issue state — pre-need in particular is state-regulated. */
  state?: string;
  /** Case/household name used on statements and letters. */
  caseName?: string;
  /** Date the current status took effect (drives chargeback duration). */
  statusDate?: string;
  /** Number of premium payments made to date. */
  paymentMonths?: number;
  isReplacement?: boolean;
  replacedPolicyNumber?: string;
  /** Funeral home the pre-need case was sold through, when applicable. */
  funeralHomeName?: string;
}

export interface Policy extends PolicyCompensationFields {
  id: string;
  policyNumber: string;
  policyType: PolicyType;
  status: PolicyStatus;
  issueDate: string;
  effectiveDate: string;
  expiryDate?: string;
  premiumAmount: number;
  premiumFrequency: PremiumFrequency;
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
  entityType: 'beneficiary' | 'policy' | 'policyholder' | 'benefit' | 'policyLoan';
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
  beneficiaryType?: BeneficiaryType;
  perStirpes?: boolean;
}

// Cash Value related types
export interface CashValueDetails {
  policyId: string;
  policyNumber: string;
  currentCashValue: number;
  surrenderValue: number;
  surrenderCharges: number;
  loanBalance: number;
  netSurrenderValue: number;
  accumulatedDividends: number;
  paidUpAdditions: number;
  guaranteedCashValue: number;
  nonGuaranteedCashValue: number;
  lastCalculatedDate: string;
}

export interface SurrenderRequest {
  id: string;
  policyId: string;
  policyNumber: string;
  requestDate: string;
  surrenderType: SurrenderType;
  requestedAmount: number;
  netPayoutAmount: number;
  surrenderCharges: number;
  taxWithholding: number;
  status: SurrenderRequestStatus;
  reason: string;
  paymentMethod: PaymentMethod;
  bankAccountLast4?: string;
  processedDate?: string;
  confirmationNumber?: string;
  auditTrail?: AuditEntry[];
}

export type SurrenderType = 'Full' | 'Partial';

export type SurrenderRequestStatus = 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';

export type PaymentMethod = 'Check' | 'ACH' | 'Wire';

export interface SurrenderFormData {
  surrenderType: SurrenderType;
  partialAmount?: number;
  reason: string;
  paymentMethod: PaymentMethod;
  bankAccountLast4?: string;
}

// ── Policy Loan (loan-against-cash-value) types ─────────────────────────────
// These mirror the fields the "Policy Loan Approval" DocuGene template reads
// from the `loanApproval` namespace. The template's `loanCalculation`
// namespace (interest projections, decision, utilization, etc.) is produced
// by the external CalcGene Excel engine and is intentionally NOT modeled
// here — PAS only owns the request/approval facts, not the calculation.
export type PolicyLoanStatus = 'Pending' | 'Approved' | 'Partially Approved' | 'Rejected' | 'Disbursed';

export interface PolicyLoan {
  id: string;
  policyId: string;
  policyNumber: string;
  approvalNumber: string;
  status: PolicyLoanStatus;
  requestDate: string;
  effectiveDate: string;
  requestedAmount: number;
  approvedAmount: number;
  cashValueReviewed: number;
  annualInterestRate: number; // percentage, e.g. 5.25 for 5.25%
  interestMethod: string;
  repaymentTerms: string;
  disbursementMethod: string;
  disbursementTiming: string;
  nextStepMessage?: string;
  notes?: string;
  auditTrail?: AuditEntry[];
}

export interface PolicyLoanFormData {
  policyId: string;
  approvalNumber: string;
  status: PolicyLoanStatus;
  requestDate: string;
  effectiveDate: string;
  requestedAmount: number;
  approvedAmount: number;
  cashValueReviewed: number;
  annualInterestRate: number;
  interestMethod: string;
  repaymentTerms: string;
  disbursementMethod: string;
  disbursementTiming: string;
  nextStepMessage?: string;
  notes?: string;
}

// Carrier branding + signatory used to populate the letter's `carrier` and
// `signatory` namespaces. Single-record "profile" for this demo instance.
export interface CarrierProfile {
  name: string;
  tagline?: string;
  phone: string;
  website: string;
  addressLine1: string;
  cityStateZip: string;
  serviceEmail: string;
  servicePhone: string;
  logo?: {
    url: string;
    width?: string;
    height?: string;
  };
}

export interface Signatory {
  name: string;
  title: string;
  department: string;
  signature?: string;
}
