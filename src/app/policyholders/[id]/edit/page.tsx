// This is a server component (no 'use client' directive)
import PolicyholderEditClient from './PolicyholderEditClient';
import { Metadata } from 'next';

type RouteParams = { params: Promise<{ id: string }> };

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Policyholder ${id} | SVG Policy Admin`,
    description: `Edit details for policyholder ${id}`,
  };
}

export default async function EditPolicyholderPage({ params }: RouteParams) {
  const { id } = await params;
  // Pass the ID directly to the client component
  return <PolicyholderEditClient id={id} />;
}
