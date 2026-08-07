import { NextResponse } from 'next/server';
import { carrierProfile, signatory } from '@/lib/data/mock-data';

// Static demo-instance carrier branding + signatory used to populate the
// `carrier`/`signatory` namespaces in generated policyholder correspondence.
export async function GET() {
  return NextResponse.json({ carrier: carrierProfile, signatory });
}
