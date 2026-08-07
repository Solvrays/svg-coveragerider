import { NextRequest, NextResponse } from 'next/server';
import { getPolicyLoans, getPolicyLoansByPolicyId, createPolicyLoan } from '@/lib/services/mockDataService';
import { PolicyLoan } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');

    const data = policyId
      ? getPolicyLoansByPolicyId(policyId)
      : getPolicyLoans();

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/policy-loans failed:', error);
    return NextResponse.json({ error: 'Failed to fetch policy loans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<PolicyLoan, 'id'>;

    if (!body.policyId || !body.policyNumber || body.requestedAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: policyId, policyNumber, requestedAmount' },
        { status: 400 }
      );
    }

    const created = createPolicyLoan(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/policy-loans failed:', error);
    return NextResponse.json({ error: 'Failed to create policy loan' }, { status: 500 });
  }
}
