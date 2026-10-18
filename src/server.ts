import 'dotenv/config';
import { createApp } from './infra/composition/create-app';
import { createPrismaClient } from './infra/db/prisma-client';

async function main(): Promise<void> {
  const prisma = createPrismaClient();
  const port = Number(process.env.PORT ?? 3000);

  try {
    await prisma.$connect();
    const server = createApp(prisma).listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    const shutdown = () => {
      server.close(() => { void prisma.$disconnect(); });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to connect to PostgreSQL', error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

void main();
