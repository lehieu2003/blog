'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Eye, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      // Insert markdown image syntax at cursor position
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const imageMarkdown = `![${file.name}](${data.url})`;

        onChange(before + imageMarkdown + after);

        // Set cursor position after inserted text
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + imageMarkdown.length,
            start + imageMarkdown.length,
          );
        }, 0);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant={preview ? 'outline' : 'default'}
            size='sm'
            onClick={() => setPreview(false)}
          >
            <Code className='w-4 h-4 mr-1' />
            Edit
          </Button>
          <Button
            type='button'
            variant={preview ? 'default' : 'outline'}
            size='sm'
            onClick={() => setPreview(true)}
          >
            <Eye className='w-4 h-4 mr-1' />
            Preview
          </Button>
        </div>
        <div>
          <input
            type='file'
            id='image-upload'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading}
          >
            <Upload className='w-4 h-4 mr-1' />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>

      {preview ? (
        <div className='min-h-[400px] border rounded-md p-4 bg-muted/20'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            className='prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100
              prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950 prose-blockquote:py-1 prose-blockquote:italic
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-table:border prose-table:border-gray-300
              prose-th:bg-gray-100 dark:prose-th:bg-gray-800
              prose-td:border prose-td:border-gray-300'
          >
            {value || '*No content yet*'}
          </ReactMarkdown>
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className='min-h-[400px] font-mono text-sm'
        />
      )}

      <div className='text-xs text-muted-foreground'>
        Supports Markdown: **bold**, *italic*, # headings, [links](url),
        ![images](url), code blocks, tables, and more.
      </div>
    </div>
  );
}
