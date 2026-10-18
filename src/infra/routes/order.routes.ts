import { Router } from 'express';
import type { OrderController } from '../controllers/order.controller';

export function createOrderRouter(controller: OrderController): Router {
  const router = Router();
  router.post('/', (req, res) => controller.createOrder(req, res));
  router.get('/', (req, res) => controller.listOrders(req, res));
  router.get('/:id', (req, res) => controller.getOrderById(req, res));
  router.patch('/:id', (req, res) => controller.updateOrder(req, res));
  router.delete('/:id', (req, res) => controller.deleteOrder(req, res));
  return router;
}
