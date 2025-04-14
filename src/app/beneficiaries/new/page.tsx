'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBeneficiary() {
  const router = useRouter();
  
  // Redirect to the edit page with 'new' ID
  useEffect(() => {
    router.push('/beneficiaries/new/edit');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Redirecting to beneficiary form...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
}
