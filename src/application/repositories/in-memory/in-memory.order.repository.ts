import type { Order } from '../../domain/order';
import type { OrderChanges, OrderRepository } from '../order.repository';

export class InMemoryOrderRepository implements OrderRepository {
  public orders: Order[] = [];

  async create(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async update(id: string, changes: OrderChanges): Promise<Order | null> {
    const order = await this.findById(id);
    if (!order) return null;
    Object.assign(order, changes);
    return order;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }
}
