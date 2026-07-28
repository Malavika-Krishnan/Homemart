import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    if (env.NODE_ENV === 'development' && (error.message?.includes('ECONNREFUSED') || error.name === 'MongooseServerSelectionError')) {
      console.log('\n[MongoDB] Local MongoDB service not detected.');
      console.log('[MongoDB] Starting temporary in-memory database for development...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoMemoryServer = await MongoMemoryServer.create();
        const mongoUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB] In-Memory Database connected successfully! (${mongoUri})\n`);
        return;
      } catch (memErr) {
        console.error('[MongoDB] Failed to start in-memory database:', memErr);
      }
    }
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
