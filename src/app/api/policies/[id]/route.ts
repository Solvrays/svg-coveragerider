import { NextRequest, NextResponse } from 'next/server';
import { getPolicy, updatePolicy } from '@/lib/services/mockDataService';
import { Policy, FieldChange } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const policy = getPolicy(id);

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json({ data: policy });
  } catch (error) {
    console.error('GET /api/policies/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getPolicy(id);

    if (!existing) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const body = await request.json() as Partial<Policy>;

    const updated: Policy = { ...existing, ...body, id };

    const changes: FieldChange[] = (Object.keys(body) as (keyof Policy)[])
      .filter(key => key !== 'id' && key !== 'auditTrail')
      .filter(key => JSON.stringify(existing[key]) !== JSON.stringify(body[key]))
      .map(key => ({
        field: key,
        oldValue: existing[key],
        newValue: body[key],
      }));

    const result = updatePolicy(updated, changes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('PUT /api/policies/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}
