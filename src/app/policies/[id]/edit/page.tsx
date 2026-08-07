// This is a server component (no 'use client' directive)
import PolicyEditClient from './PolicyEditClient';
import { Metadata } from 'next';

type RouteParams = { params: Promise<{ id: string }> };

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Policy ${id} | Solvrays Policy Admin`,
    description: `Edit details for policy ${id}`,
  };
}

export default async function EditPolicyPage({ params }: RouteParams) {
  const { id } = await params;
  // Pass the ID directly to the client component
  return <PolicyEditClient id={id} />;
}
