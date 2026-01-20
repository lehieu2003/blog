'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor';

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          coverImage,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create post');
      } else {
        router.push('/posts/me');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Write New Post</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error && (
              <div className='bg-destructive/10 text-destructive px-4 py-2 rounded'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <label htmlFor='title' className='text-sm font-medium'>
                Title *
              </label>
              <Input
                id='title'
                placeholder='Enter post title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='excerpt' className='text-sm font-medium'>
                Excerpt (Optional)
              </label>
              <Textarea
                id='excerpt'
                placeholder='Brief description of your post'
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='coverImage'>Cover Image URL (Optional)</Label>
              <Input
                id='coverImage'
                placeholder='https://example.com/image.jpg'
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label>Content *</Label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            <div className='flex gap-4'>
              <Button
                onClick={() => handleSubmit('draft')}
                variant='outline'
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={loading}
              >
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
