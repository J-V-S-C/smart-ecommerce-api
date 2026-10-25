import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryOrderRepository } from '../../../src/application/repositories/in-memory/in-memory.order.repository';
import { OrderService } from '../../../src/application/services/order.service';

describe('OrderService', () => {
  let repository: InMemoryOrderRepository;
  let service: OrderService;

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    service = new OrderService(repository);
  });

  it('creates and persists an order', async () => {
    const id = await service.createOrder({ buyer_id: 'buyer-1', product_id: 'product-1' });

    expect(id).toEqual(expect.any(String));
    await expect(service.findOrderById(id)).resolves.toMatchObject({
      id,
      buyer_id: 'buyer-1',
      product_id: 'product-1',
    });
  });

  it('finds an existing order and returns null for an unknown id', async () => {
    const id = await service.createOrder({ buyer_id: 'buyer-1', product_id: 'product-1' });

    await expect(service.findOrderById(id)).resolves.toMatchObject({ buyer_id: 'buyer-1' });
    await expect(service.findOrderById('unknown')).resolves.toBeNull();
  });

  it('lists all orders', async () => {
    await service.createOrder({ buyer_id: 'buyer-1', product_id: 'product-1' });
    await service.createOrder({ buyer_id: 'buyer-2', product_id: 'product-2' });

    await expect(service.listOrders()).resolves.toEqual([
      expect.objectContaining({ buyer_id: 'buyer-1', product_id: 'product-1' }),
      expect.objectContaining({ buyer_id: 'buyer-2', product_id: 'product-2' }),
    ]);
  });

  it('updates an existing order and returns null for an unknown id', async () => {
    const id = await service.createOrder({ buyer_id: 'buyer-1', product_id: 'product-1' });

    await expect(service.updateOrder(id, { buyer_id: 'buyer-2', product_id: 'product-2' })).resolves.toMatchObject({
      id,
      buyer_id: 'buyer-2',
      product_id: 'product-2',
    });
    await expect(service.updateOrder('unknown', { buyer_id: 'buyer-3' })).resolves.toBeNull();
  });

  it('deletes an existing order and returns false for an unknown id', async () => {
    const id = await service.createOrder({ buyer_id: 'buyer-1', product_id: 'product-1' });

    await expect(service.deleteOrder(id)).resolves.toBe(true);
    await expect(service.findOrderById(id)).resolves.toBeNull();
    await expect(service.deleteOrder('unknown')).resolves.toBe(false);
  });
});
