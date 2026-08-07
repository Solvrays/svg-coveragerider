import { NextRequest, NextResponse } from 'next/server';
import { getPolicyLoan, updatePolicyLoan } from '@/lib/services/mockDataService';
import { PolicyLoan, FieldChange } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const loan = getPolicyLoan(id);

    if (!loan) {
      return NextResponse.json({ error: 'Policy loan not found' }, { status: 404 });
    }

    return NextResponse.json({ data: loan });
  } catch (error) {
    console.error('GET /api/policy-loans/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policy loan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getPolicyLoan(id);

    if (!existing) {
      return NextResponse.json({ error: 'Policy loan not found' }, { status: 404 });
    }

    const body = await request.json() as Partial<PolicyLoan>;

    const updated: PolicyLoan = { ...existing, ...body, id };

    const changes: FieldChange[] = (Object.keys(body) as (keyof PolicyLoan)[])
      .filter(key => key !== 'id' && key !== 'auditTrail')
      .filter(key => JSON.stringify(existing[key]) !== JSON.stringify(body[key]))
      .map(key => ({
        field: key,
        oldValue: existing[key],
        newValue: body[key],
      }));

    const result = updatePolicyLoan(updated, changes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('PUT /api/policy-loans/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update policy loan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}
