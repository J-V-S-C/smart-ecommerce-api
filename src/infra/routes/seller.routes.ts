import { Router } from 'express';
import type { SellerController } from '../controllers/seller.controller';

export function createSellerRouter(controller: SellerController): Router {
  const router = Router();
  router.post('/', (req, res) => controller.createSeller(req, res));
  router.get('/', (req, res) => controller.listSellers(req, res));
  router.get('/:id', (req, res) => controller.getSellerById(req, res));
  router.patch('/:id', (req, res) => controller.updateSeller(req, res));
  router.delete('/:id', (req, res) => controller.deleteSeller(req, res));
  return router;
}
