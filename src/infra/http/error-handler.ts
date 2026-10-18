import type { ErrorRequestHandler } from 'express';
import { Prisma } from '../../generated/prisma/client';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Related record not found' });
      return;
    }
    if (error.code === 'P2002' || error.code === 'P2003' || error.code === 'P2014') {
      res.status(409).json({ error: 'Database constraint conflict' });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
