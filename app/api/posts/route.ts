import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Tag } from '@/models/Tag';
import { generateSlug } from '@/lib/helpers';

// GET /api/posts - Get all published posts (public) or user's posts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    let query: any = {};

    // If not logged in, only show published posts
    if (!session) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (authorId) {
      query.authorId = authorId;
    }

    const posts = await Post.find(query)
      .populate('authorId', 'name email')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create new post (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { title, content, excerpt, coverImage, status, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let existingPost = await Post.findOne({ slug });
    let counter = 1;

    while (existingPost) {
      slug = `${generateSlug(title)}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      status: status || 'draft',
      authorId: session.user.id,
      tags: tags || [],
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email')
      .populate('tags', 'name slug');

    return NextResponse.json({ post: populatedPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 },
    );
  }
}
