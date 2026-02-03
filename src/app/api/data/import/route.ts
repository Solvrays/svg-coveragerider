import { NextRequest, NextResponse } from 'next/server';
import { importAllData, BulkExportData } from '@/lib/services/persistence';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as BulkExportData;
    
    if (!data || !data.data) {
      return NextResponse.json(
        { error: 'Invalid import data', message: 'Request body must contain valid export data' },
        { status: 400 }
      );
    }
    
    const result = importAllData(data);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Data imported successfully. Refresh the page to load new data.',
        imported: result.imported,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Import failed', imported: result.imported },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Import failed:', error);
    return NextResponse.json(
      { error: 'Import failed' },
      { status: 500 }
    );
  }
}
