'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import DOMPurify from 'isomorphic-dompurify';
import 'highlight.js/styles/github-dark.css';

function isHTMLContent(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export default function RichContentRenderer({ content }: { content: string }) {
  const isHTML = isHTMLContent(content);

  const baseClass = 'prose prose-lg max-w-none dark:prose-invert ...';

  if (isHTML) {
    const cleanHTML = DOMPurify.sanitize(content);

    return (
      <div
        className={baseClass}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
      className={baseClass}
    >
      {content}
    </ReactMarkdown>
  );
}
