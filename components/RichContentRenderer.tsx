'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface RichContentRendererProps {
  content: string;
}

export default function RichContentRenderer({
  content,
}: RichContentRendererProps) {
  // Check if content is HTML (from TipTap) or Markdown
  const isHTML = content.trim().startsWith('<');

  if (isHTML) {
    // Render HTML content directly with enhanced styles
    return (
      <div
        className='prose prose-lg max-w-none dark:prose-invert
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
          prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2
          prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
          prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
          prose-em:text-gray-800 dark:prose-em:text-gray-200
          prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-pink-600 dark:prose-code:text-pink-400
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4
          prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
          prose-table:border-collapse prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-700 prose-table:my-6
          prose-thead:bg-gray-100 dark:prose-thead:bg-gray-800
          prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
          prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Render Markdown content (backward compatibility)
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      className='prose prose-lg max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
        prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
        prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2
        prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
        prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
        prose-em:text-gray-800 dark:prose-em:text-gray-200
        prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-pink-600 dark:prose-code:text-pink-400
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6
        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
        prose-table:border-collapse prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-700 prose-table:my-6
        prose-thead:bg-gray-100 dark:prose-thead:bg-gray-800
        prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
        prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8'
    >
      {content}
    </ReactMarkdown>
  );
}
