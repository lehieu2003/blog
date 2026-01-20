'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [mainTag, setMainTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchTags();
  }, [params.id]);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      const data = await response.json();

      if (response.ok && data.post) {
        setTitle(data.post.title);
        setContent(data.post.content);
        setExcerpt(data.post.excerpt || '');
        setCoverImage(data.post.coverImage || '');
        setStatus(data.post.status);

        // Set tags
        if (data.post.tags && Array.isArray(data.post.tags)) {
          const tagIds = data.post.tags.map((tag: any) => tag._id || tag);
          setSelectedTags(tagIds);
          if (tagIds.length > 0) {
            setMainTag(tagIds[0]);
          }
        }
      } else {
        setError('Failed to load post');
      }
    } catch (err) {
      setError('An error occurred while loading the post');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
      if (mainTag === tagId) {
        setMainTag('');
      }
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (newStatus: 'draft' | 'published') => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Ensure main tag is in selected tags
      const finalTags =
        mainTag && !selectedTags.includes(mainTag)
          ? [...selectedTags, mainTag]
          : selectedTags;

      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          coverImage,
          status: newStatus,
          tags: finalTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update post');
      } else {
        router.push('/posts/me');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
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
        <Card>
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error && (
              <div className='bg-destructive/10 text-destructive px-4 py-3 rounded'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Enter post title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='excerpt'>Excerpt</Label>
              <Textarea
                id='excerpt'
                placeholder='Brief description of your post (optional)'
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='coverImage'>Cover Image URL</Label>
              <Input
                id='coverImage'
                placeholder='https://example.com/image.jpg (optional)'
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='mainTag'>Main Tag</Label>
              <Select value={mainTag} onValueChange={setMainTag}>
                <SelectTrigger>
                  <SelectValue placeholder='Select main tag (optional)' />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag._id} value={tag._id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Additional Tags</Label>
              <div className='flex flex-wrap gap-2 border rounded-md p-3'>
                {tags.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No tags available.
                  </p>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag._id}
                      type='button'
                      onClick={() => toggleTag(tag._id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag._id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Content *</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder='Write your post content...'
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                onClick={() => router.back()}
                variant='outline'
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit('draft')}
                variant='outline'
                disabled={saving}
                className='flex-1'
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className='flex-1'
              >
                {saving
                  ? 'Saving...'
                  : status === 'published'
                    ? 'Update'
                    : 'Publish'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
