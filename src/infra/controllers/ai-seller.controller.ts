import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AISellerService } from '../../application/services/ai-seller.service';

const idSchema = z.object({ id: z.uuid() });
const createSchema = z.object({
  seller_id: z.uuid(),
  product_id: z.uuid(),
});
const updateSchema = createSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
);

export class AISellerController {
  constructor(private aiSellerService: AISellerService) {}

  async createAISeller(req: Request, res: Response): Promise<Response> {
    const body = createSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const id = await this.aiSellerService.createAISeller(body.data);
    return res.status(201).json({ id });
  }

  async getAISellerById(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    const aiSeller = await this.aiSellerService.findAISellerById(params.data.id);
    return aiSeller ? res.status(200).json(aiSeller) : res.sendStatus(404);
  }

  async listAISellers(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.aiSellerService.listAISellers());
  }

  async updateAISeller(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    const body = updateSchema.safeParse(req.body);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const aiSeller = await this.aiSellerService.updateAISeller(params.data.id, body.data);
    return aiSeller ? res.status(200).json(aiSeller) : res.sendStatus(404);
  }

  async deleteAISeller(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    return (await this.aiSellerService.deleteAISeller(params.data.id))
      ? res.sendStatus(204) : res.sendStatus(404);
  }
}
