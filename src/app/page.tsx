'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './loading';

export default function Home() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // show loader for ~4.5s; start exit at 4.0s then navigate at 4.5s
    const duration = 4500;
    const exitAt = duration - 500; // 500ms exit animation
    const startExit = setTimeout(() => setExiting(true), exitAt);
    const nav = setTimeout(() => router.replace('/login'), duration);

    return () => {
      clearTimeout(startExit);
      clearTimeout(nav);
    };
  }, [router]);

  return <Loading exiting={exiting} duration={4500} />;
}
