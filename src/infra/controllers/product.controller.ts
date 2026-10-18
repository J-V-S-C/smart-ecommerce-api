import type { ProductService } from '../../application/services/product.service';
import type { Request, Response } from 'express';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive().max(9_999_999_999.99).multipleOf(0.01),
});

const getProductByIdSchema = z.object({
  id: z.uuid(),
});

const updateProductSchema = createProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
);

export class ProductController {
  constructor(private productService: ProductService) {}

  async createProduct(req: Request, res: Response): Promise<Response> {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }

    const id = await this.productService.createProduct(parsed.data);

    return res.status(201).json({ id });
  }

  async getProductById(req: Request, res: Response): Promise<Response> {
    const parsed = getProductByIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const product = await this.productService.findProductById(parsed.data.id);
    return product ? res.status(200).json(product) : res.sendStatus(404);
  }

  async listProducts(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.productService.listProducts());
  }

  async updateProduct(req: Request, res: Response): Promise<Response> {
    const params = getProductByIdSchema.safeParse(req.params);
    const body = updateProductSchema.safeParse(req.body);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    if (!body.success) return res.status(400).json({ errors: body.error.issues });

    const product = await this.productService.updateProduct(params.data.id, body.data);
    return product ? res.status(200).json(product) : res.sendStatus(404);
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const params = getProductByIdSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });

    const deleted = await this.productService.deleteProduct(params.data.id);
    return deleted ? res.sendStatus(204) : res.sendStatus(404);
  }
}
