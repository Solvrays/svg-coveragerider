import { NextRequest, NextResponse } from 'next/server';
import { getPolicyHolders, createPolicyHolder } from '@/lib/services/mockDataService';
import { PolicyHolder } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let data = getPolicyHolders();

    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(
        ph =>
          ph.firstName.toLowerCase().includes(lower) ||
          ph.lastName.toLowerCase().includes(lower) ||
          ph.email.toLowerCase().includes(lower)
      );
    }

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/policyholders failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policyholders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<PolicyHolder, 'id'>;

    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      );
    }

    const created = createPolicyHolder(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/policyholders failed:', error);
    return NextResponse.json({ error: 'Failed to create policyholder' }, { status: 500 });
  }
}
