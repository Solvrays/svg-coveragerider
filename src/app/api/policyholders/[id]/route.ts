import { NextRequest, NextResponse } from 'next/server';
import { getPolicyHolder, updatePolicyHolder } from '@/lib/services/mockDataService';
import { PolicyHolder, FieldChange } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const policyholder = getPolicyHolder(id);

    if (!policyholder) {
      return NextResponse.json({ error: 'Policyholder not found' }, { status: 404 });
    }

    return NextResponse.json({ data: policyholder });
  } catch (error) {
    console.error('GET /api/policyholders/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policyholder' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getPolicyHolder(id);

    if (!existing) {
      return NextResponse.json({ error: 'Policyholder not found' }, { status: 404 });
    }

    const body = await request.json() as Partial<PolicyHolder>;

    const updated: PolicyHolder = { ...existing, ...body, id };

    const changes: FieldChange[] = (Object.keys(body) as (keyof PolicyHolder)[])
      .filter(key => key !== 'id' && key !== 'auditTrail')
      .filter(key => JSON.stringify(existing[key]) !== JSON.stringify(body[key]))
      .map(key => ({
        field: key,
        oldValue: existing[key],
        newValue: body[key],
      }));

    const result = updatePolicyHolder(updated, changes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('PUT /api/policyholders/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update policyholder' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}
