import { Router } from 'express';
import type { ProductController } from '../controllers/product.controller';

export function createProductRouter(productController: ProductController): Router {
  const router = Router();

  router.post('/', (req, res) => productController.createProduct(req, res));
  router.get('/search', (req, res) => productController.searchProducts(req, res));
  router.get('/', (req, res) => productController.listProducts(req, res));
  router.get('/:id', (req, res) => productController.getProductById(req, res));
  router.patch('/:id', (req, res) => productController.updateProduct(req, res));
  router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

  return router;
}
