// This is a server component (no 'use client' directive)
import BenefitEditClient from './BenefitEditClient';
import { Metadata } from 'next';

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Edit Benefit ${params.id} | SVG Policy Admin`,
    description: `Edit details for benefit ${params.id}`,
  };
}

export default function BenefitEditPage({ params }: { params: { id: string } }) {
  // Pass the ID directly to the client component
  return <BenefitEditClient id={params.id} />;
}
