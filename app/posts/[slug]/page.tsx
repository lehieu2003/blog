import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { formatDate } from '@/lib/helpers';
import Link from 'next/link';
import RichContentRenderer from '@/components/RichContentRenderer';

async function getPost(slug: string) {
  await connectDB();

  const post = await Post.findOne({ slug, status: 'published' })
    .populate('authorId', 'name email')
    .populate('tags', 'name slug')
    .lean();

  if (!post) return null;

  return JSON.parse(JSON.stringify(post));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <article className='max-w-4xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 leading-tight'>
            {post.title}
          </h1>
          <div className='flex items-center text-muted-foreground space-x-2 mb-4'>
            <span className='font-medium'>
              By {post.authorId?.name || 'Anonymous'}
            </span>
            <span>•</span>
            <time>{formatDate(post.publishedAt)}</time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {post.tags.map((tag: any) => (
                <Link
                  key={tag._id}
                  href={`/tags/${tag.slug}`}
                  className='text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full transition-colors'
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className='mb-8 rounded-lg overflow-hidden shadow-lg'>
            <img
              src={post.coverImage}
              alt={post.title}
              className='w-full h-auto object-cover'
            />
          </div>
        )}

        <RichContentRenderer content={post.content} />
      </article>
    </div>
  );
}
