import type { Request, Response } from 'express';
import { z } from 'zod';
import type { BuyerService } from '../../application/services/buyer.service';

const idSchema = z.object({ id: z.uuid() });
const createSchema = z.object({
  name: z.string().min(1),
  balance: z.number().nonnegative().max(9_999_999_999.99).multipleOf(0.01),
});
const updateSchema = createSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
);

export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  async createBuyer(req: Request, res: Response): Promise<Response> {
    const body = createSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const id = await this.buyerService.createBuyer(body.data);
    return res.status(201).json({ id });
  }

  async getBuyerById(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    const buyer = await this.buyerService.findBuyerById(params.data.id);
    return buyer ? res.status(200).json(buyer) : res.sendStatus(404);
  }

  async listBuyers(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.buyerService.listBuyers());
  }

  async updateBuyer(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    const body = updateSchema.safeParse(req.body);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const buyer = await this.buyerService.updateBuyer(params.data.id, body.data);
    return buyer ? res.status(200).json(buyer) : res.sendStatus(404);
  }

  async deleteBuyer(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    return (await this.buyerService.deleteBuyer(params.data.id))
      ? res.sendStatus(204) : res.sendStatus(404);
  }
}
