import { NextRequest, NextResponse } from 'next/server';
import { getPolicyLoanLetterData } from '@/lib/services/mockDataService';

type RouteParams = { params: Promise<{ id: string }> };

// Single-call package for the PulseGene "Policy Loan Approval" letter workflow.
// Returns `data` (policy with policyholders expanded), `carrier`, `signatory`,
// and `loanApproval` (the latest policy loan's approval facts) — everything
// the DocuGene template needs except `loanCalculation`, which is produced by
// the external CalcGene Excel engine and is out of scope for PAS.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const letterData = getPolicyLoanLetterData(id);

    if (!letterData) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    if (!letterData.loanApproval) {
      return NextResponse.json(
        { error: 'No policy loan found for this policy', data: letterData.data },
        { status: 404 }
      );
    }

    return NextResponse.json(letterData);
  } catch (error) {
    console.error('GET /api/policies/[id]/loan-letter-data failed:', error);
    return NextResponse.json({ error: 'Failed to build loan letter data' }, { status: 500 });
  }
}
