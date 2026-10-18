import { Order } from '../../application/domain/order';
import type { OrderChanges, OrderRepository } from '../../application/repositories/order.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toOrder(row: { id: string; buyerId: string; productId: string }): Order {
  return new Order(row.id, row.buyerId, row.productId);
}

export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: Order): Promise<Order> {
    return toOrder(await this.prisma.order.create({ data: {
      id: order.id,
      buyerId: order.buyer_id,
      productId: order.product_id,
    } }));
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({ where: { id } });
    return row ? toOrder(row) : null;
  }

  async findAll(): Promise<Order[]> {
    return (await this.prisma.order.findMany({ orderBy: { id: 'asc' } })).map(toOrder);
  }

  async update(id: string, changes: OrderChanges): Promise<Order | null> {
    try {
      return toOrder(await this.prisma.order.update({
        where: { id },
        data: { buyerId: changes.buyer_id, productId: changes.product_id },
      }));
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.prisma.order.deleteMany({ where: { id } })).count > 0;
  }
}
