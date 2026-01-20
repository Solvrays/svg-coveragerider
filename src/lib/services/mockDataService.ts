import { v4 as uuidv4 } from 'uuid';
import { 
  Policy, 
  PolicyHolder, 
  Beneficiary, 
  AuditEntry, 
  FieldChange,
  CashValueDetails,
  SurrenderRequest,
  SurrenderType,
  SurrenderRequestStatus,
  PaymentMethod
} from '@/lib/types';
import { 
  policies as initialPolicies, 
  policyHolders as initialPolicyHolders, 
  beneficiariesData as initialBeneficiaries,
  auditEntries as initialAuditEntries
} from '@/lib/data/mock-data';

// In-memory storage for mock data
let policies = [...initialPolicies];
let policyHolders = [...initialPolicyHolders];
let beneficiaries = [...initialBeneficiaries];
let auditEntries = [...initialAuditEntries || []];

// Get current user (in a real app, this would come from authentication)
const getCurrentUser = () => {
  return {
    id: 'user-001',
    name: 'Admin User'
  };
};

// Generate a unique ID
const generateId = (prefix: string) => {
  return `${prefix}-${uuidv4()}`;
};

// Create audit entry
const createAuditEntry = (
  action: 'create' | 'update' | 'delete',
  entityType: 'policy' | 'policyholder' | 'beneficiary' | 'benefit',
  entityId: string,
  changes?: FieldChange[],
  notes?: string
): AuditEntry => {
  const currentUser = getCurrentUser();
  
  return {
    id: generateId('audit'),
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    userName: currentUser.name,
    action,
    entityType,
    entityId,
    changes,
    notes
  };
};

// Policy methods
export const getPolicies = () => {
  return [...policies];
};

export const getPolicy = (id: string) => {
  return policies.find(p => p.id === id);
};

export const updatePolicy = (updatedPolicy: Policy, changes: FieldChange[]) => {
  // Create audit entry
  const auditEntry = createAuditEntry(
    'update',
    'policy',
    updatedPolicy.id,
    changes,
    `Policy updated on ${new Date().toLocaleString()}`
  );
  
  // Update policy with audit trail
  const policyWithAudit = {
    ...updatedPolicy,
    auditTrail: [
      ...(updatedPolicy.auditTrail || []),
      auditEntry
    ]
  };
  
  // Update policies array
  policies = policies.map(p => 
    p.id === policyWithAudit.id ? policyWithAudit : p
  );
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return policyWithAudit;
};

export const createPolicy = (newPolicy: Omit<Policy, 'id'>) => {
  const policy = {
    ...newPolicy,
    id: generateId('policy')
  } as Policy;
  
  // Create audit entry
  const auditEntry = createAuditEntry(
    'create',
    'policy',
    policy.id,
    undefined,
    `Policy created on ${new Date().toLocaleString()}`
  );
  
  // Add audit trail to policy
  policy.auditTrail = [auditEntry];
  
  // Add to policies array
  policies.push(policy);
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return policy;
};

// Policyholder methods
export const getPolicyHolders = () => {
  return [...policyHolders];
};

export const getPolicyHolder = (id: string) => {
  return policyHolders.find(ph => ph.id === id);
};

export const updatePolicyHolder = (updatedPolicyHolder: PolicyHolder, changes: FieldChange[]) => {
  // Create audit entry
  const auditEntry = createAuditEntry(
    'update',
    'policyholder',
    updatedPolicyHolder.id,
    changes,
    `Policyholder updated on ${new Date().toLocaleString()}`
  );
  
  // Update policyholder with audit trail
  const policyHolderWithAudit = {
    ...updatedPolicyHolder,
    auditTrail: [
      ...(updatedPolicyHolder.auditTrail || []),
      auditEntry
    ]
  };
  
  // Update policyHolders array
  policyHolders = policyHolders.map(ph => 
    ph.id === policyHolderWithAudit.id ? policyHolderWithAudit : ph
  );
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return policyHolderWithAudit;
};

export const createPolicyHolder = (newPolicyHolder: Omit<PolicyHolder, 'id'>) => {
  const policyHolder = {
    ...newPolicyHolder,
    id: generateId('ph')
  } as PolicyHolder;
  
  // Create audit entry
  const auditEntry = createAuditEntry(
    'create',
    'policyholder',
    policyHolder.id,
    undefined,
    `Policyholder created on ${new Date().toLocaleString()}`
  );
  
  // Add audit trail to policyholder
  policyHolder.auditTrail = [auditEntry];
  
  // Add to policyHolders array
  policyHolders.push(policyHolder);
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return policyHolder;
};

// Beneficiary methods
export const getBeneficiaries = () => {
  return [...beneficiaries];
};

export const getBeneficiary = (id: string) => {
  return beneficiaries.find(b => b.id === id);
};

export const getBeneficiariesByPolicyId = (policyId: string) => {
  return beneficiaries.filter(b => b.policyId === policyId);
};

export const updateBeneficiary = (updatedBeneficiary: Beneficiary, changes: FieldChange[]) => {
  // Create audit entry
  const auditEntry = createAuditEntry(
    'update',
    'beneficiary',
    updatedBeneficiary.id,
    changes,
    `Beneficiary updated on ${new Date().toLocaleString()}`
  );
  
  // Update beneficiary with audit trail
  const beneficiaryWithAudit = {
    ...updatedBeneficiary,
    auditTrail: [
      ...(updatedBeneficiary.auditTrail || []),
      auditEntry
    ]
  };
  
  // Update beneficiaries array
  beneficiaries = beneficiaries.map(b => 
    b.id === beneficiaryWithAudit.id ? beneficiaryWithAudit : b
  );
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return beneficiaryWithAudit;
};

export const createBeneficiary = (newBeneficiary: Omit<Beneficiary, 'id'>) => {
  const beneficiary = {
    ...newBeneficiary,
    id: generateId('ben')
  } as Beneficiary;
  
  // Create audit entry
  const auditEntry = createAuditEntry(
    'create',
    'beneficiary',
    beneficiary.id,
    undefined,
    `Beneficiary created on ${new Date().toLocaleString()}`
  );
  
  // Add audit trail to beneficiary
  beneficiary.auditTrail = [auditEntry];
  
  // Add to beneficiaries array
  beneficiaries.push(beneficiary);
  
  // Add to global audit entries
  auditEntries.push(auditEntry);
  
  return beneficiary;
};

// Audit trail methods
export const getAuditEntries = () => {
  return [...auditEntries];
};

export const getAuditEntriesByEntityId = (entityId: string) => {
  return auditEntries.filter(ae => ae.entityId === entityId);
};

export const getAuditEntriesByEntityType = (entityType: 'policy' | 'policyholder' | 'beneficiary' | 'benefit') => {
  return auditEntries.filter(ae => ae.entityType === entityType);
};

// Reset mock data (for testing)
export const resetMockData = () => {
  policies = [...initialPolicies];
  policyHolders = [...initialPolicyHolders];
  beneficiaries = [...initialBeneficiaries];
  auditEntries = [...initialAuditEntries || []];
};

// Mock cash value data for policies with cash value
const mockCashValues: Map<string, CashValueDetails> = new Map([
  ['pol-001', {
    policyId: 'pol-001',
    policyNumber: 'LFP-12345678',
    currentCashValue: 15000.00,
    surrenderValue: 14250.00,
    surrenderCharges: 750.00,
    loanBalance: 0,
    netSurrenderValue: 14250.00,
    accumulatedDividends: 1200.00,
    paidUpAdditions: 3500.00,
    guaranteedCashValue: 11250.00,
    nonGuaranteedCashValue: 3750.00,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  }],
  ['pol-003', {
    policyId: 'pol-003',
    policyNumber: 'LFP-34567890',
    currentCashValue: 25000.00,
    surrenderValue: 23750.00,
    surrenderCharges: 1250.00,
    loanBalance: 0,
    netSurrenderValue: 23750.00,
    accumulatedDividends: 2500.00,
    paidUpAdditions: 5000.00,
    guaranteedCashValue: 18750.00,
    nonGuaranteedCashValue: 6250.00,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  }],
  ['pol-004', {
    policyId: 'pol-004',
    policyNumber: 'ANT-45678901',
    currentCashValue: 102500.00,
    surrenderValue: 97375.00,
    surrenderCharges: 5125.00,
    loanBalance: 0,
    netSurrenderValue: 97375.00,
    accumulatedDividends: 2500.00,
    paidUpAdditions: 0,
    guaranteedCashValue: 100000.00,
    nonGuaranteedCashValue: 2500.00,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  }]
]);

// Mock surrender requests
const surrenderRequests: SurrenderRequest[] = [];

// Cash value functions
export const getCashValueDetails = (policyId: string): CashValueDetails | undefined => {
  const policy = getPolicy(policyId);
  
  if (!policy || policy.cashValue === undefined) {
    return undefined;
  }
  
  // Return existing cash value or generate mock data
  if (mockCashValues.has(policyId)) {
    return mockCashValues.get(policyId);
  }
  
  // Generate mock cash value for eligible policies
  const baseCashValue = policy.cashValue || 0;
  const surrenderCharges = baseCashValue * 0.05;
  
  const cashValue: CashValueDetails = {
    policyId,
    policyNumber: policy.policyNumber,
    currentCashValue: baseCashValue,
    surrenderValue: baseCashValue - surrenderCharges,
    surrenderCharges,
    loanBalance: 0,
    netSurrenderValue: baseCashValue - surrenderCharges,
    accumulatedDividends: baseCashValue * 0.08,
    paidUpAdditions: baseCashValue * 0.15,
    guaranteedCashValue: baseCashValue * 0.75,
    nonGuaranteedCashValue: baseCashValue * 0.25,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  };
  
  mockCashValues.set(policyId, cashValue);
  return cashValue;
};

export const calculateSurrenderValue = (
  policyId: string,
  surrenderType: SurrenderType,
  partialAmount?: number
): { grossAmount: number; surrenderCharges: number; taxWithholding: number; netAmount: number } | undefined => {
  const cashValue = getCashValueDetails(policyId);
  
  if (!cashValue) {
    return undefined;
  }
  
  let grossAmount: number;
  
  if (surrenderType === 'Full') {
    grossAmount = cashValue.currentCashValue;
  } else {
    // Partial surrender - use requested amount or 50% of cash value
    grossAmount = Math.min(partialAmount || cashValue.currentCashValue * 0.5, cashValue.currentCashValue * 0.9);
  }
  
  // Calculate charges (5% for full, 3% for partial)
  const chargeRate = surrenderType === 'Full' ? 0.05 : 0.03;
  const surrenderCharges = grossAmount * chargeRate;
  
  // Calculate tax withholding (10% federal)
  const taxWithholding = grossAmount * 0.10;
  
  const netAmount = grossAmount - surrenderCharges - taxWithholding;
  
  return {
    grossAmount: parseFloat(grossAmount.toFixed(2)),
    surrenderCharges: parseFloat(surrenderCharges.toFixed(2)),
    taxWithholding: parseFloat(taxWithholding.toFixed(2)),
    netAmount: parseFloat(netAmount.toFixed(2))
  };
};

export const createSurrenderRequest = (
  policyId: string,
  surrenderType: SurrenderType,
  requestedAmount: number,
  reason: string,
  paymentMethod: PaymentMethod,
  bankAccountLast4?: string
): SurrenderRequest | undefined => {
  const policy = getPolicy(policyId);
  if (!policy) return undefined;
  
  const calculation = calculateSurrenderValue(policyId, surrenderType, requestedAmount);
  
  if (!calculation) {
    return undefined;
  }
  
  const currentUser = getCurrentUser();
  
  const request: SurrenderRequest = {
    id: generateId('sr'),
    policyId,
    policyNumber: policy.policyNumber,
    requestDate: new Date().toISOString().split('T')[0],
    surrenderType,
    requestedAmount: calculation.grossAmount,
    netPayoutAmount: calculation.netAmount,
    surrenderCharges: calculation.surrenderCharges,
    taxWithholding: calculation.taxWithholding,
    status: 'Pending' as SurrenderRequestStatus,
    reason,
    paymentMethod,
    bankAccountLast4,
    auditTrail: [{
      id: generateId('audit'),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'create',
      entityType: 'policy',
      entityId: policyId,
      notes: `Surrender request created: ${surrenderType} surrender for ${calculation.grossAmount}`
    }]
  };
  
  surrenderRequests.push(request);
  return request;
};

export const getSurrenderRequests = (policyId: string): SurrenderRequest[] => {
  return surrenderRequests.filter(req => req.policyId === policyId);
};

export const getSurrenderRequestById = (requestId: string): SurrenderRequest | undefined => {
  return surrenderRequests.find(req => req.id === requestId);
};

export const processSurrenderRequest = (
  requestId: string,
  approve: boolean
): SurrenderRequest | undefined => {
  const requestIndex = surrenderRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    return undefined;
  }
  
  const request = surrenderRequests[requestIndex];
  const currentUser = getCurrentUser();
  
  if (approve) {
    request.status = 'Approved' as SurrenderRequestStatus;
    request.processedDate = new Date().toISOString().split('T')[0];
    request.confirmationNumber = `CONF-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // If full surrender, update policy status
    if (request.surrenderType === 'Full') {
      const policy = getPolicy(request.policyId);
      if (policy) {
        const updatedPolicy = {
          ...policy,
          status: 'Cancelled' as const
        };
        updatePolicy(updatedPolicy, [{
          field: 'status',
          oldValue: policy.status,
          newValue: 'Cancelled'
        }]);
      }
    }
    
    // Add audit entry
    request.auditTrail = [
      ...(request.auditTrail || []),
      {
        id: generateId('audit'),
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'update',
        entityType: 'policy',
        entityId: request.policyId,
        notes: `Surrender request approved. Confirmation: ${request.confirmationNumber}`
      }
    ];
  } else {
    request.status = 'Rejected' as SurrenderRequestStatus;
    request.processedDate = new Date().toISOString().split('T')[0];
    
    request.auditTrail = [
      ...(request.auditTrail || []),
      {
        id: generateId('audit'),
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'update',
        entityType: 'policy',
        entityId: request.policyId,
        notes: 'Surrender request rejected'
      }
    ];
  }
  
  surrenderRequests[requestIndex] = request;
  return request;
};

// Check if policy is eligible for surrender
export const isPolicyEligibleForSurrender = (policyId: string): { eligible: boolean; reason?: string } => {
  const policy = getPolicy(policyId);
  
  if (!policy) {
    return { eligible: false, reason: 'Policy not found' };
  }
  
  // Only certain policy types can be surrendered
  const surrenderableTypes = ['Whole Life', 'Universal Life', 'Variable Life', 'Annuity'];
  if (!surrenderableTypes.includes(policy.policyType)) {
    return { eligible: false, reason: 'This policy type cannot be surrendered' };
  }
  
  if (policy.status === 'Cancelled') {
    return { eligible: false, reason: 'Policy has already been cancelled' };
  }
  
  if (policy.status === 'Expired') {
    return { eligible: false, reason: 'Policy has expired' };
  }
  
  if (policy.status === 'Lapsed') {
    return { eligible: false, reason: 'Policy has lapsed' };
  }
  
  const cashValue = getCashValueDetails(policyId);
  if (!cashValue || cashValue.currentCashValue <= 0) {
    return { eligible: false, reason: 'Policy has no cash value' };
  }
  
  return { eligible: true };
};
