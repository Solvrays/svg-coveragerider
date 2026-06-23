import { NextResponse } from 'next/server';
import { 
  policiesPersistence, 
  policyHoldersPersistence, 
  beneficiariesPersistence,
  benefitsPersistence,
  auditEntriesPersistence
} from '@/lib/services/persistence';

export async function POST() {
  try {
    policiesPersistence.resetAllRecords();
    policyHoldersPersistence.resetAllRecords();
    beneficiariesPersistence.resetAllRecords();
    benefitsPersistence.resetAllRecords();
    auditEntriesPersistence.resetAllRecords();
    
    return NextResponse.json({
      success: true,
      message: 'All records reset to original state. Refresh the page to see changes.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Reset failed:', error);
    return NextResponse.json(
      { error: 'Reset failed' },
      { status: 500 }
    );
  }
}
