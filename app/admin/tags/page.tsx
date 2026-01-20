'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create tag');
      } else {
        setTags([...tags, data.tag]);
        setNewTagName('');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags(tags.filter((t) => t._id !== tagId));
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
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
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Manage Tags</h1>
          <Link href='/admin'>
            <Button variant='outline'>Back to Dashboard</Button>
          </Link>
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Create New Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className='flex gap-4'>
              <Input
                placeholder='Tag name'
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
              />
              <Button type='submit' disabled={creating}>
                {creating ? 'Creating...' : 'Create Tag'}
              </Button>
            </form>
            {error && (
              <div className='mt-4 bg-destructive/10 text-destructive px-4 py-2 rounded'>
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className='space-y-2'>
          {tags.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>
              No tags created yet.
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag._id}
                className='flex justify-between items-center p-4 border rounded-lg'
              >
                <div>
                  <span className='font-medium'>{tag.name}</span>
                  <span className='text-muted-foreground ml-2'>
                    ({tag.slug})
                  </span>
                </div>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(tag._id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
