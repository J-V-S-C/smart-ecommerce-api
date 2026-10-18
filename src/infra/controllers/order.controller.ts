import type { Request, Response } from 'express';
import { z } from 'zod';
import type { OrderService } from '../../application/services/order.service';

const idSchema = z.object({ id: z.uuid() });
const createSchema = z.object({
  buyer_id: z.uuid(),
  product_id: z.uuid(),
});
const updateSchema = createSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
);

export class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(req: Request, res: Response): Promise<Response> {
    const body = createSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const id = await this.orderService.createOrder(body.data);
    return res.status(201).json({ id });
  }

  async getOrderById(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    const order = await this.orderService.findOrderById(params.data.id);
    return order ? res.status(200).json(order) : res.sendStatus(404);
  }

  async listOrders(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.orderService.listOrders());
  }

  async updateOrder(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    const body = updateSchema.safeParse(req.body);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    if (!body.success) return res.status(400).json({ errors: body.error.issues });
    const order = await this.orderService.updateOrder(params.data.id, body.data);
    return order ? res.status(200).json(order) : res.sendStatus(404);
  }

  async deleteOrder(req: Request, res: Response): Promise<Response> {
    const params = idSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ errors: params.error.issues });
    return (await this.orderService.deleteOrder(params.data.id))
      ? res.sendStatus(204) : res.sendStatus(404);
  }
}
