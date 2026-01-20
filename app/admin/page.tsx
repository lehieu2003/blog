'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FileText, Tags, Users } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8'>Admin Dashboard</h1>

        <div className='grid md:grid-cols-3 gap-6'>
          <Link href='/admin/posts'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <FileText className='w-12 h-12 mb-4 text-primary' />
                <CardTitle>Manage Posts</CardTitle>
                <CardDescription>
                  View and manage all posts in the system
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/admin/tags'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <Tags className='w-12 h-12 mb-4 text-primary' />
                <CardTitle>Manage Tags</CardTitle>
                <CardDescription>
                  Create and manage tags for posts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/admin/users'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <Users className='w-12 h-12 mb-4 text-primary' />
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
