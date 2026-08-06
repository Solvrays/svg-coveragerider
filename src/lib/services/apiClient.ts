import { Policy, PolicyHolder, Beneficiary, Benefit } from '@/lib/types';

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
