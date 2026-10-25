import { Router } from 'express';
import type { AIController } from '../controllers/ai.controller';

export function createAIRouter(aiController: AIController): Router {
  const router = Router();
  router.post('/', (req, res) => aiController.callAI(req, res));
  return router;
}
