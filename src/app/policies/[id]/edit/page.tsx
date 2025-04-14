// This is a server component (no 'use client' directive)
import PolicyEditClient from './PolicyEditClient';
import { Metadata } from 'next';

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Edit Policy ${params.id} | Solvrays Policy Admin`,
    description: `Edit details for policy ${params.id}`,
  };
}

export default function EditPolicyPage({ params }: { params: { id: string } }) {
  // Pass the ID directly to the client component
  return <PolicyEditClient id={params.id} />;
}
