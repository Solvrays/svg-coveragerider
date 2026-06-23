import { NextRequest, NextResponse } from 'next/server';
import { getBenefit, updateBenefit, deleteBenefit } from '@/lib/services/mockDataService';
import { Benefit, FieldChange } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const benefit = getBenefit(id);

    if (!benefit) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    return NextResponse.json({ data: benefit });
  } catch (error) {
    console.error('GET /api/benefits/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch benefit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getBenefit(id);

    if (!existing) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    const body = await request.json() as Partial<Benefit>;

    const updated: Benefit = { ...existing, ...body, id };

    const changes: FieldChange[] = (Object.keys(body) as (keyof Benefit)[])
      .filter(key => key !== 'id' && key !== 'auditTrail')
      .filter(key => JSON.stringify(existing[key]) !== JSON.stringify(body[key]))
      .map(key => ({
        field: key,
        oldValue: existing[key],
        newValue: body[key],
      }));

    const result = updateBenefit(updated, changes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('PUT /api/benefits/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update benefit' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = getBenefit(id);

    if (!existing) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    const deleted = deleteBenefit(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete benefit' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Benefit ${id} deleted` });
  } catch (error) {
    console.error('DELETE /api/benefits/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to delete benefit' }, { status: 500 });
  }
}
