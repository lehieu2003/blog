'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/auth/signin?registered=true');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a new account to start writing
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              {error && (
                <div className='bg-destructive/10 text-destructive px-4 py-2 rounded'>
                  {error}
                </div>
              )}
              <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium'>
                  Name
                </label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium'>
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4'>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
              <p className='text-sm text-center text-muted-foreground'>
                Already have an account?{' '}
                <Link
                  href='/auth/signin'
                  className='text-primary hover:underline'
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
