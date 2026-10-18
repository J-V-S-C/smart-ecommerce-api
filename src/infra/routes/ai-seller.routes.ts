import { Router } from 'express';
import type { AISellerController } from '../controllers/ai-seller.controller';

export function createAISellerRouter(controller: AISellerController): Router {
  const router = Router();
  router.post('/', (req, res) => controller.createAISeller(req, res));
  router.get('/', (req, res) => controller.listAISellers(req, res));
  router.get('/:id', (req, res) => controller.getAISellerById(req, res));
  router.patch('/:id', (req, res) => controller.updateAISeller(req, res));
  router.delete('/:id', (req, res) => controller.deleteAISeller(req, res));
  return router;
}
