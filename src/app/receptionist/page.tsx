'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReceptionistPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to reception dashboard
    router.push('/receptionist/dashboard');
  }, [router]);

  return null;
}
