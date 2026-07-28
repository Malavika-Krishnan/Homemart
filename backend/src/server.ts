import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  await connectDatabase();

  const app = createApp();
  const PORT = env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`[HomeMart Backend] Server running on http://localhost:${PORT}`);
    console.log(`[HomeMart Backend] Environment: ${env.NODE_ENV}`);
  });
};

startServer();
