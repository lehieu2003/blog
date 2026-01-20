import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    // Ensure models are registered
    await ensureModelsRegistered();
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    // Register models after connection
    await ensureModelsRegistered();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Ensure all models are registered
async function ensureModelsRegistered() {
  // Import models to ensure they're registered
  if (!mongoose.models.User) {
    await import('@/models/User');
  }
  if (!mongoose.models.Post) {
    await import('@/models/Post');
  }
  if (!mongoose.models.Tag) {
    await import('@/models/Tag');
  }
}
