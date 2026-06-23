import { NextRequest, NextResponse } from 'next/server';
import { getBeneficiaries, getBeneficiariesByPolicyId, createBeneficiary } from '@/lib/services/mockDataService';
import { Beneficiary } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');

    const data = policyId
      ? getBeneficiariesByPolicyId(policyId)
      : getBeneficiaries();

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/beneficiaries failed:', error);
    return NextResponse.json({ error: 'Failed to fetch beneficiaries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Beneficiary, 'id'>;

    if (!body.firstName || !body.lastName || !body.policyId) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, policyId' },
        { status: 400 }
      );
    }

    const created = createBeneficiary(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/beneficiaries failed:', error);
    return NextResponse.json({ error: 'Failed to create beneficiary' }, { status: 500 });
  }
}
