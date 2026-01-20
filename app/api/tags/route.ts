import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Tag } from '@/models/Tag';
import { generateSlug } from '@/lib/helpers';

// GET /api/tags - Get all tags (public)
export async function GET() {
  try {
    await connectDB();

    const tags = await Tag.find().sort({ name: 1 }).lean();

    return NextResponse.json({ tags }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tags' },
      { status: 500 },
    );
  }
}

// POST /api/tags - Create new tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 },
      );
    }

    const slug = generateSlug(name);

    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 },
      );
    }

    const tag = await Tag.create({ name, slug });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create tag' },
      { status: 500 },
    );
  }
}
