import { Policy, PolicyHolder, Beneficiary, Benefit, PolicyLoan, CarrierProfile, Signatory } from '@/lib/types';

// Central fetch-based client for the app's own /api/* routes.
// Every list/detail/edit page should go through here instead of importing
// mockDataService or the static mock-data arrays directly, so that changes
// made through the API are always reflected in the UI.

const API_BASE = '/api';

class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body?.error || `Request to ${path} failed with status ${res.status}`);
  }
  return body as T;
}

// ── Policies ────────────────────────────────────────────────────────────────

export async function fetchPolicies(): Promise<Policy[]> {
  const { data } = await request<{ data: Policy[] }>('/policies');
  return data;
}

export async function fetchPolicy(id: string): Promise<Policy | null> {
  try {
    const { data } = await request<{ data: Policy }>(`/policies/${encodeURIComponent(id)}`);
    return data;
  } catch {
    return null;
  }
}

export async function createPolicy(payload: Omit<Policy, 'id'>): Promise<Policy> {
  const { data } = await request<{ data: Policy }>('/policies', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updatePolicy(id: string, payload: Partial<Policy>): Promise<Policy> {
  const { data } = await request<{ data: Policy }>(`/policies/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
}

// ── Policyholders ───────────────────────────────────────────────────────────

export async function fetchPolicyHolders(): Promise<PolicyHolder[]> {
  const { data } = await request<{ data: PolicyHolder[] }>('/policyholders');
  return data;
}

export async function fetchPolicyHolder(id: string): Promise<PolicyHolder | null> {
  try {
    const { data } = await request<{ data: PolicyHolder }>(`/policyholders/${encodeURIComponent(id)}`);
    return data;
  } catch {
    return null;
  }
}

export async function createPolicyHolder(payload: Omit<PolicyHolder, 'id'>): Promise<PolicyHolder> {
  const { data } = await request<{ data: PolicyHolder }>('/policyholders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updatePolicyHolder(id: string, payload: Partial<PolicyHolder>): Promise<PolicyHolder> {
  const { data } = await request<{ data: PolicyHolder }>(`/policyholders/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
}

// ── Beneficiaries ───────────────────────────────────────────────────────────

export async function fetchBeneficiaries(policyId?: string): Promise<Beneficiary[]> {
  const query = policyId ? `?policyId=${encodeURIComponent(policyId)}` : '';
  const { data } = await request<{ data: Beneficiary[] }>(`/beneficiaries${query}`);
  return data;
}

export async function fetchBeneficiary(id: string): Promise<Beneficiary | null> {
  try {
    const { data } = await request<{ data: Beneficiary }>(`/beneficiaries/${encodeURIComponent(id)}`);
    return data;
  } catch {
    return null;
  }
}

export async function createBeneficiary(payload: Omit<Beneficiary, 'id'>): Promise<Beneficiary> {
  const { data } = await request<{ data: Beneficiary }>('/beneficiaries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updateBeneficiary(id: string, payload: Partial<Beneficiary>): Promise<Beneficiary> {
  const { data } = await request<{ data: Beneficiary }>(`/beneficiaries/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function deleteBeneficiary(id: string): Promise<void> {
  await request<{ success: boolean }>(`/beneficiaries/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Benefits ────────────────────────────────────────────────────────────────

export async function fetchBenefits(policyId?: string): Promise<Benefit[]> {
  const query = policyId ? `?policyId=${encodeURIComponent(policyId)}` : '';
  const { data } = await request<{ data: Benefit[] }>(`/benefits${query}`);
  return data;
}

export async function fetchBenefit(id: string): Promise<Benefit | null> {
  try {
    const { data } = await request<{ data: Benefit }>(`/benefits/${encodeURIComponent(id)}`);
    return data;
  } catch {
    return null;
  }
}

export async function createBenefit(payload: Omit<Benefit, 'id'>): Promise<Benefit> {
  const { data } = await request<{ data: Benefit }>('/benefits', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updateBenefit(id: string, payload: Partial<Benefit>): Promise<Benefit> {
  const { data } = await request<{ data: Benefit }>(`/benefits/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function deleteBenefit(id: string): Promise<void> {
  await request<{ success: boolean }>(`/benefits/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Policy Loans ────────────────────────────────────────────────────────────

export async function fetchPolicyLoans(policyId?: string): Promise<PolicyLoan[]> {
  const query = policyId ? `?policyId=${encodeURIComponent(policyId)}` : '';
  const { data } = await request<{ data: PolicyLoan[] }>(`/policy-loans${query}`);
  return data;
}

export async function fetchPolicyLoan(id: string): Promise<PolicyLoan | null> {
  try {
    const { data } = await request<{ data: PolicyLoan }>(`/policy-loans/${encodeURIComponent(id)}`);
    return data;
  } catch {
    return null;
  }
}

export async function createPolicyLoan(payload: Omit<PolicyLoan, 'id'>): Promise<PolicyLoan> {
  const { data } = await request<{ data: PolicyLoan }>('/policy-loans', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updatePolicyLoan(id: string, payload: Partial<PolicyLoan>): Promise<PolicyLoan> {
  const { data } = await request<{ data: PolicyLoan }>(`/policy-loans/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
}

// Combined package used by the PulseGene "Policy Loan Approval" letter
// workflow: policy (with policyholders expanded) + carrier + signatory +
// the latest loan's approval facts.
export interface PolicyLoanLetterData {
  data: {
    id: string;
    status: Policy['status'];
    cashValue?: number;
    issueDate: string;
    faceAmount: number;
    policyType: Policy['policyType'];
    policyNumber: string;
    effectiveDate: string;
    policyholders: Pick<PolicyHolder, 'id' | 'email' | 'phone' | 'address' | 'lastName' | 'firstName'>[];
  };
  carrier: CarrierProfile;
  signatory: Signatory;
  loanApproval: {
    amount: string;
    cashValue: string;
    requestDate: string;
    interestRate: string;
    effectiveDate: string;
    approvalNumber: string;
    interestMethod: string;
    repaymentTerms: string;
    nextStepMessage?: string;
    disbursementMethod: string;
    disbursementTiming: string;
  } | null;
  correspondence: {
    letterDate: string;
  };
}

export async function fetchPolicyLoanLetterData(policyId: string): Promise<PolicyLoanLetterData> {
  return request<PolicyLoanLetterData>(`/policies/${encodeURIComponent(policyId)}/loan-letter-data`);
}

// ── Carrier config ──────────────────────────────────────────────────────────

export async function fetchCarrierConfig(): Promise<{ carrier: CarrierProfile; signatory: Signatory }> {
  return request<{ carrier: CarrierProfile; signatory: Signatory }>('/carrier-config');
}
