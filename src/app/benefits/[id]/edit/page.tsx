// This is a server component (no 'use client' directive)
import BenefitEditClient from './BenefitEditClient';
import { Metadata } from 'next';

type RouteParams = { params: Promise<{ id: string }> };

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Benefit ${id} | SVG Policy Admin`,
    description: `Edit details for benefit ${id}`,
  };
}

export default async function BenefitEditPage({ params }: RouteParams) {
  const { id } = await params;
  // Pass the ID directly to the client component
  return <BenefitEditClient id={id} />;
}
