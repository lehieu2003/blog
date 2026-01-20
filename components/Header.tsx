'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { PenSquare, LogOut, User, Shield } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 py-4'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link href='/' className='text-2xl font-bold'>
              My Blog
            </Link>
            <div className='hidden md:flex space-x-4'>
              <Link href='/' className='hover:text-primary'>
                Home
              </Link>
              <Link href='/search' className='hover:text-primary'>
                Search
              </Link>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            {session ? (
              <>
                <Link href='/write'>
                  <Button variant='outline' size='sm'>
                    <PenSquare className='w-4 h-4 mr-2' />
                    Write
                  </Button>
                </Link>
                <Link href='/posts/me'>
                  <Button variant='ghost' size='sm'>
                    <User className='w-4 h-4 mr-2' />
                    My Posts
                  </Button>
                </Link>
                {session.user.role === 'admin' && (
                  <Link href='/admin'>
                    <Button variant='ghost' size='sm'>
                      <Shield className='w-4 h-4 mr-2' />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className='w-4 h-4 mr-2' />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href='/auth/signin'>
                  <Button variant='outline' size='sm'>
                    Sign In
                  </Button>
                </Link>
                <Link href='/auth/signup'>
                  <Button size='sm'>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
