import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/homemart_db',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_homemart_2026_permanent_token',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
