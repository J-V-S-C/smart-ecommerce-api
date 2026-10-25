import express from 'express';
import type { PrismaClient } from '../../generated/prisma/client';
import { errorHandler } from '../http/error-handler';
import { PrismaProductRepository } from '../repositories/prisma-product.repository';
import { PrismaBuyerRepository } from '../repositories/prisma-buyer.repository';
import { PrismaSellerRepository } from '../repositories/prisma-seller.repository';
import { PrismaOrderRepository } from '../repositories/prisma-order.repository';
import { PrismaAISellerRepository } from '../repositories/prisma-ai-seller.repository';
import { ProductService } from '../../application/services/product.service';
import { BuyerService } from '../../application/services/buyer.service';
import { SellerService } from '../../application/services/seller.service';
import { OrderService } from '../../application/services/order.service';
import { AISellerService } from '../../application/services/ai-seller.service';
import { AIService } from '../../application/services/ai.service';
import { ProductController } from '../controllers/product.controller';
import { BuyerController } from '../controllers/buyer.controller';
import { SellerController } from '../controllers/seller.controller';
import { OrderController } from '../controllers/order.controller';
import { AISellerController } from '../controllers/ai-seller.controller';
import { AIController } from '../controllers/ai.controller';
import { createProductRouter } from '../routes/product.routes';
import { createBuyerRouter } from '../routes/buyer.routes';
import { createSellerRouter } from '../routes/seller.routes';
import { createOrderRouter } from '../routes/order.routes';
import { createAISellerRouter } from '../routes/ai-service.routes';
import { createAIRouter } from '../routes/ai.routes';

export function createApp(prisma: PrismaClient): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/health', async (_request, response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      response.status(200).json({ status: 'ok' });
    } catch {
      response.status(503).json({ status: 'unhealthy' });
    }
  });

  const productRepository = new PrismaProductRepository(prisma);
  app.use(
    '/products',
    createProductRouter(
      new ProductController(new ProductService(productRepository)),
    ),
  );
  app.use(
    '/ai',
    createAIRouter(new AIController(new AIService(productRepository))),
  );
  app.use(
    '/buyers',
    createBuyerRouter(
      new BuyerController(new BuyerService(new PrismaBuyerRepository(prisma))),
    ),
  );
  app.use(
    '/sellers',
    createSellerRouter(
      new SellerController(
        new SellerService(new PrismaSellerRepository(prisma)),
      ),
    ),
  );
  app.use(
    '/orders',
    createOrderRouter(
      new OrderController(new OrderService(new PrismaOrderRepository(prisma))),
    ),
  );
  /*
  app.use(
    '/ai-sellers',
    createAISellerRouter(
      new AISellerController(
        new AISellerService(new PrismaAISellerRepository(prisma)),
      ),
    ),
  );
*/
  app.use(errorHandler);
  return app;
}
