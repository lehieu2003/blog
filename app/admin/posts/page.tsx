'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { formatDate } from '@/lib/helpers';
import { Trash2, Edit } from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Manage All Posts</h1>
          <div className='flex gap-2'>
            <Link href='/admin/posts/new'>
              <Button>New Post</Button>
            </Link>
            <Link href='/admin'>
              <Button variant='outline'>Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>No posts found.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {posts.map((post) => (
              <Card
                key={post._id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex justify-between items-start gap-4'>
                    <div className='flex-1 min-w-0'>
                      <Link href={`/posts/${post.slug}`}>
                        <CardTitle className='hover:text-primary transition-colors cursor-pointer text-xl mb-2'>
                          {post.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className='flex items-center gap-2 flex-wrap'>
                        <span>By {post.authorId?.name || 'Unknown'}</span>
                        <span>•</span>
                        {post.status === 'draft' ? (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'>
                            Draft
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                            Published
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </CardDescription>
                    </div>
                    <div className='flex gap-2 flex-shrink-0'>
                      {post.status === 'published' && (
                        <Link href={`/posts/${post.slug}`}>
                          <Button variant='outline' size='sm' title='View Post'>
                            View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/posts/edit/${post._id}`}>
                        <Button variant='outline' size='sm' title='Edit Post'>
                          <Edit className='w-4 h-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDelete(post._id)}
                        title='Delete Post'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
