import { Router } from 'express';
import type { AIController } from '../controllers/ai.controller';

export function createAISellerRouter(controller: AIController): Router {
  const router = Router();
  router.post('/', (req, res) => controller.callAI(req, res));
  return router;
}
