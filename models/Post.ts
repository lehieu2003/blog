import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: 'draft' | 'published';
  authorId: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
