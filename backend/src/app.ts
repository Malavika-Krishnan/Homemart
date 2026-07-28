import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

export const createApp = (): Application => {
  const app: Application = express();

  // Security Headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Rate Limiting
  app.use('/api', apiRateLimiter);

  // Root Welcome Route
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to HomeMart Backend API',
      health: '/health',
      apiBaseUrl: '/api/v1',
      documentation: 'See backend/docs/API_DOCUMENTATION.md for details',
    });
  });

  // Health Check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'HomeMart Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/v1', apiRoutes);

  // 404 Route
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Resource or API route not found',
    });
  });

  // Global Error Middleware
  app.use(errorHandler);

  return app;
};
