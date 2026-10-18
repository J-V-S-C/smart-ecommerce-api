import { Order } from '../domain/order';
import type { OrderChanges, OrderRepository } from '../repositories/order.repository';

export interface CreateOrderInput {
  buyer_id: string;
  product_id: string;
}

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async createOrder({ buyer_id, product_id }: CreateOrderInput): Promise<string> {
    const order = Order.create(buyer_id, product_id);
    await this.orderRepository.create(order);
    return order.id;
  }

  findOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  listOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  updateOrder(id: string, changes: OrderChanges): Promise<Order | null> {
    return this.orderRepository.update(id, changes);
  }

  deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }
}
