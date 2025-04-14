import { v4 as uuidv4 } from 'uuid';
import { 
  Policy, 
  PolicyHolder, 
  Beneficiary, 
  AuditEntry, 
  FieldChange 
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
