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

async function getPosts() {
  await connectDB();

  const posts = await Post.find({ status: 'published' })
    .populate('authorId', 'name')
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-2'>Latest Posts</h1>
          <p className='text-muted-foreground text-lg'>
            Discover the newest articles and insights
          </p>
        </div>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>
              No posts yet. Be the first to write!
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {posts.map((post: any) => (
              <Card
                key={post._id}
                className='hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary'
              >
                <CardHeader>
                  <Link href={`/posts/${post.slug}`}>
                    <CardTitle className='hover:text-primary transition-colors cursor-pointer text-2xl mb-2'>
                      {post.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className='flex items-center gap-2 text-sm'>
                    <span className='font-medium'>
                      {post.authorId?.name || 'Anonymous'}
                    </span>
                    <span>•</span>
                    <time>{formatDate(post.publishedAt)}</time>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/posts/${post.slug}`}>
                    <p className='text-muted-foreground mb-4 line-clamp-3 hover:text-foreground transition-colors cursor-pointer'>
                      {post.excerpt || truncateText(post.content, 200)}
                    </p>
                  </Link>
                  {post.tags && post.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {post.tags.map((tag: any) => (
                        <Link
                          key={tag._id}
                          href={`/tags/${tag.slug}`}
                          className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors'
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
