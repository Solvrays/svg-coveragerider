import { NextRequest, NextResponse } from 'next/server';
import { getPolicies, createPolicy } from '@/lib/services/mockDataService';
import { Policy } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const policyType = searchParams.get('policyType');
    const policyholderId = searchParams.get('policyholderId');

    let data = getPolicies();

    if (status) {
      data = data.filter(p => p.status === status);
    }
    if (policyType) {
      data = data.filter(p => p.policyType === policyType);
    }
    if (policyholderId) {
      data = data.filter(p => p.policyholderIds.includes(policyholderId));
    }

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/policies failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Policy, 'id'>;

    if (!body.policyNumber || !body.policyType || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: policyNumber, policyType, status' },
        { status: 400 }
      );
    }

    const created = createPolicy(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/policies failed:', error);
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}
