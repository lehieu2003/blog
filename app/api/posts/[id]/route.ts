import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Tag } from '@/models/Tag';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const post = await Post.findById(params.id)
      .populate('authorId', 'name email')
      .populate('tags', 'name slug');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user can view draft posts
    const session = await getServerSession(authOptions);
    if (post.status === 'draft') {
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Only author or admin can view draft
      if (
        session.user.role !== 'admin' &&
        post.authorId._id.toString() !== session.user.id
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 },
    );
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check permission: owner or admin
    if (
      session.user.role !== 'admin' &&
      post.authorId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, status, tags } = body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags;

    // Update status and publishedAt
    if (status && status !== post.status) {
      post.status = status;
      if (status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email')
      .populate('tags', 'name slug');

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check permission: owner or admin
    if (
      session.user.role !== 'admin' &&
      post.authorId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Post.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 },
    );
  }
}
