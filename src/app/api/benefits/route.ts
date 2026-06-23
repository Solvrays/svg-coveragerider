import { NextRequest, NextResponse } from 'next/server';
import { getBenefits, getBenefitsByPolicyId, createBenefit } from '@/lib/services/mockDataService';
import { Benefit } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let data = policyId ? getBenefitsByPolicyId(policyId) : getBenefits();

    if (status) {
      data = data.filter(b => b.status === status);
    }
    if (type) {
      data = data.filter(b => b.type === type);
    }

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/benefits failed:', error);
    return NextResponse.json({ error: 'Failed to fetch benefits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Benefit, 'id'>;

    if (!body.name || !body.type || !body.policyId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, policyId' },
        { status: 400 }
      );
    }

    const created = createBenefit(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/benefits failed:', error);
    return NextResponse.json({ error: 'Failed to create benefit' }, { status: 500 });
  }
}
