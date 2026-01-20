'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
