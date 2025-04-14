import ReportViewClient from './ReportViewClient';
import { Metadata } from 'next';

// Define the generateMetadata function for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Report ${params.id} | SVG Policy Admin`,
    description: `View detailed information about report ${params.id}`,
  };
}

// Server component that passes the ID to the client component
export default function ReportViewPage({ params }: { params: { id: string } }) {
  return <ReportViewClient reportId={params.id} />;
}
