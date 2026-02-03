import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/services/persistence';

export async function DELETE() {
  try {
    clearAllData();
    
    return NextResponse.json({
      success: true,
      message: 'All data cleared. Refresh the page to regenerate fresh mock data.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Clear failed:', error);
    return NextResponse.json(
      { error: 'Clear failed' },
      { status: 500 }
    );
  }
}
