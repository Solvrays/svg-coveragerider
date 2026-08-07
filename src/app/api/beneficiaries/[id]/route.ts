import { NextRequest, NextResponse } from 'next/server';
import { getBeneficiary, updateBeneficiary, deleteBeneficiary } from '@/lib/services/mockDataService';
import { Beneficiary, FieldChange } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const beneficiary = getBeneficiary(id);

    if (!beneficiary) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    return NextResponse.json({ data: beneficiary });
  } catch (error) {
    console.error('GET /api/beneficiaries/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch beneficiary' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getBeneficiary(id);

    if (!existing) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    const body = await request.json() as Partial<Beneficiary>;

    const updated: Beneficiary = { ...existing, ...body, id };

    const changes: FieldChange[] = (Object.keys(body) as (keyof Beneficiary)[])
      .filter(key => key !== 'id' && key !== 'auditTrail')
      .filter(key => JSON.stringify(existing[key]) !== JSON.stringify(body[key]))
      .map(key => ({
        field: key,
        oldValue: existing[key],
        newValue: body[key],
      }));

    const result = updateBeneficiary(updated, changes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('PUT /api/beneficiaries/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update beneficiary' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getBeneficiary(id);

    if (!existing) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    const deleted = deleteBeneficiary(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete beneficiary' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Beneficiary ${id} deleted` });
  } catch (error) {
    console.error('DELETE /api/beneficiaries/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to delete beneficiary' }, { status: 500 });
  }
}
