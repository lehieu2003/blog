import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Tag } from '@/models/Tag';

// DELETE /api/tags/[id] - Delete tag (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const tag = await Tag.findByIdAndDelete(params.id);

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete tag' },
      { status: 500 },
    );
  }
}
