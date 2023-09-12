"use client"
import { useEffect } from 'react';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export function RouterTransition() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  useEffect(() => {
    const handleStart = (url: string) => url !== pathname && nprogress.start();
    const handleComplete = () => nprogress.complete();

  }, [pathname]);

  return <NavigationProgress autoReset={true} />;
}