'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { formatDate, truncateText } from '@/lib/helpers';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/posts');
      const data = await response.json();

      // Simple client-side search
      const filtered = (data.posts || []).filter((post: any) => {
        if (post.status !== 'published') return false;

        const searchLower = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8'>Search Posts</h1>

        <form onSubmit={handleSearch} className='mb-8'>
          <div className='flex gap-4'>
            <Input
              placeholder='Search for posts...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='flex-1'
            />
            <Button type='submit' disabled={loading}>
              <Search className='w-4 h-4 mr-2' />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {searched && (
          <>
            {results.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>
                  No posts found matching your search.
                </p>
              </div>
            ) : (
              <>
                <p className='text-muted-foreground mb-6'>
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                <div className='space-y-6'>
                  {results.map((post: any) => (
                    <Card key={post._id}>
                      <CardHeader>
                        <Link href={`/posts/${post.slug}`}>
                          <CardTitle className='hover:text-primary transition-colors cursor-pointer'>
                            {post.title}
                          </CardTitle>
                        </Link>
                        <CardDescription>
                          By {post.authorId?.name || 'Anonymous'} •{' '}
                          {formatDate(post.publishedAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className='text-muted-foreground'>
                          {post.excerpt || truncateText(post.content, 200)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
