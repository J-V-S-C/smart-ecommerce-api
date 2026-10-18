import type { Request, Response } from 'express';
import { z } from 'zod';
import type { SellerService } from '../../application/services/seller.service';

const idSchema = z.object({ id: z.uuid() });
const createSchema = z.object({
  name: z.string().min(1),
  product_ids: z.array(z.uuid()).default([]),
});
const updateSchema = z.object({
  name: z.string().min(1).optional(),
  product_ids: z.array(z.uuid()).optional(),
}).refine(
    (value) => Object.keys(value).length > 0,
    'At least one field is required',
  );

export class SellerController {
  constructor(private sellerService: SellerService) {}

  async createSeller(req: Request, res: Response): Promise<Response> {
    const body = createSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const id = await this.sellerService.createSeller(body.data);
    return res.status(201).json({ id });
  }

  async getSellerById(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    const seller = await this.sellerService.findSellerById(params.data.id);
    return seller ? res.status(200).json(seller) : res.sendStatus(404);
  }

  async listSellers(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.sellerService.listSellers());
  }

  async updateSeller(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    const body = updateSchema.safeParse(req.body);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const seller = await this.sellerService.updateSeller(params.data.id, body.data);
    return seller ? res.status(200).json(seller) : res.sendStatus(404);
  }

  async deleteSeller(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    return (await this.sellerService.deleteSeller(params.data.id))
      ? res.sendStatus(204) : res.sendStatus(404);
  }
}
