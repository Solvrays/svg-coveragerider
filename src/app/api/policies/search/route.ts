import { NextRequest, NextResponse } from 'next/server';
import { getPolicies, getPolicyHolders } from '@/lib/services/mockDataService';
import { Policy, PolicyHolder } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const polNum = searchParams.get('polNum')?.trim().toLowerCase();
    const firstName = searchParams.get('firstName')?.trim().toLowerCase();
    const lastName = searchParams.get('lastName')?.trim().toLowerCase();

    if (!polNum && !firstName && !lastName) {
      return NextResponse.json(
        { error: 'Provide at least one search parameter: polNum, firstName, or lastName' },
        { status: 400 }
      );
    }

    const policies = getPolicies();
    const policyHolders = getPolicyHolders();
    const policyHolderById = new Map<string, PolicyHolder>(
      policyHolders.map(ph => [ph.id, ph])
    );

    const matchesName = (policy: Policy): boolean => {
      if (!firstName && !lastName) return true;

      return policy.policyholderIds.some(id => {
        const holder = policyHolderById.get(id);
        if (!holder) return false;

        const matchesFirst = firstName
          ? holder.firstName.toLowerCase().includes(firstName)
          : true;
        const matchesLast = lastName
          ? holder.lastName.toLowerCase().includes(lastName)
          : true;

        return matchesFirst && matchesLast;
      });
    };

    const results = policies.filter(policy => {
      const matchesPolNum = polNum
        ? policy.policyNumber.toLowerCase().includes(polNum)
        : true;

      return matchesPolNum && matchesName(policy);
    });

    const data = results.map(policy => ({
      ...policy,
      policyholders: policy.policyholderIds
        .map(id => policyHolderById.get(id))
        .filter((ph): ph is PolicyHolder => Boolean(ph)),
    }));

    return NextResponse.json({ data, total: data.length });
  } catch (error) {
    console.error('GET /api/policies/search failed:', error);
    return NextResponse.json({ error: 'Failed to search policies' }, { status: 500 });
  }
}
