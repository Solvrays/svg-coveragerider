import { NextResponse } from 'next/server';
import { exportAllData } from '@/lib/services/persistence';

export async function GET() {
  try {
    const data = exportAllData();
    
    return NextResponse.json(data, {
      headers: {
        'Content-Disposition': `attachment; filename=policy-admin-data-${new Date().toISOString().split('T')[0]}.json`,
      },
    });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
