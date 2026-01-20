import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { Tag } from '@/models/Tag';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { formatDate, truncateText } from '@/lib/helpers';

async function getPostsByTag(slug: string) {
  await connectDB();

  const posts = await Post.find({ status: 'published' })
    .populate('authorId', 'name')
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .lean();

  // Filter posts that have the matching tag
  const filtered = posts.filter((post: any) =>
    post.tags.some((tag: any) => tag.slug === slug),
  );

  return JSON.parse(JSON.stringify(filtered));
}

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getPostsByTag(params.slug);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold mb-2'>#{params.slug}</h1>
        <p className='text-muted-foreground mb-8'>
          {posts.length} post{posts.length !== 1 ? 's' : ''} tagged with "
          {params.slug}"
        </p>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No posts found with this tag.
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {posts.map((post: any) => (
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
        )}
      </div>
    </div>
  );
}
