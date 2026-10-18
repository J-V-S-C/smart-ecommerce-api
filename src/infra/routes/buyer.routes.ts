import { Router } from 'express';
import type { BuyerController } from '../controllers/buyer.controller';

export function createBuyerRouter(controller: BuyerController): Router {
  const router = Router();
  router.post('/', (req, res) => controller.createBuyer(req, res));
  router.get('/', (req, res) => controller.listBuyers(req, res));
  router.get('/:id', (req, res) => controller.getBuyerById(req, res));
  router.patch('/:id', (req, res) => controller.updateBuyer(req, res));
  router.delete('/:id', (req, res) => controller.deleteBuyer(req, res));
  return router;
}
