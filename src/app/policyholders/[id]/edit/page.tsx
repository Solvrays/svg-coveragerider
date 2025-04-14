// This is a server component (no 'use client' directive)
import PolicyholderEditClient from './PolicyholderEditClient';
import { Metadata } from 'next';

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Edit Policyholder ${params.id} | SVG Policy Admin`,
    description: `Edit details for policyholder ${params.id}`,
  };
}

export default function EditPolicyholderPage({ params }: { params: { id: string } }) {
  // Pass the ID directly to the client component
  return <PolicyholderEditClient id={params.id} />;
}
