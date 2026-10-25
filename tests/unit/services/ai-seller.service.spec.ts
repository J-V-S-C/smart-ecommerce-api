import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAISellerRepository } from '../../../src/application/repositories/in-memory/in-memory.ai-seller.repository';
import { AISellerService } from '../../../src/application/services/ai-seller.service';

describe('AISellerService', () => {
  let repository: InMemoryAISellerRepository;
  let service: AISellerService;

  beforeEach(() => {
    repository = new InMemoryAISellerRepository();
    service = new AISellerService(repository);
  });

  it('creates and persists an AI seller', async () => {
    const id = await service.createAISeller({ seller_id: 'seller-1', product_id: 'product-1' });

    expect(id).toEqual(expect.any(String));
    await expect(service.findAISellerById(id)).resolves.toMatchObject({
      id,
      seller_id: 'seller-1',
      product_id: 'product-1',
    });
  });

  it('finds an existing AI seller and returns null for an unknown id', async () => {
    const id = await service.createAISeller({ seller_id: 'seller-1', product_id: 'product-1' });

    await expect(service.findAISellerById(id)).resolves.toMatchObject({ seller_id: 'seller-1' });
    await expect(service.findAISellerById('unknown')).resolves.toBeNull();
  });

  it('lists all AI sellers', async () => {
    await service.createAISeller({ seller_id: 'seller-1', product_id: 'product-1' });
    await service.createAISeller({ seller_id: 'seller-2', product_id: 'product-2' });

    await expect(service.listAISellers()).resolves.toEqual([
      expect.objectContaining({ seller_id: 'seller-1', product_id: 'product-1' }),
      expect.objectContaining({ seller_id: 'seller-2', product_id: 'product-2' }),
    ]);
  });

  it('updates an existing AI seller and returns null for an unknown id', async () => {
    const id = await service.createAISeller({ seller_id: 'seller-1', product_id: 'product-1' });

    await expect(service.updateAISeller(id, { seller_id: 'seller-2', product_id: 'product-2' })).resolves.toMatchObject({
      id,
      seller_id: 'seller-2',
      product_id: 'product-2',
    });
    await expect(service.updateAISeller('unknown', { seller_id: 'seller-3' })).resolves.toBeNull();
  });

  it('deletes an existing AI seller and returns false for an unknown id', async () => {
    const id = await service.createAISeller({ seller_id: 'seller-1', product_id: 'product-1' });

    await expect(service.deleteAISeller(id)).resolves.toBe(true);
    await expect(service.findAISellerById(id)).resolves.toBeNull();
    await expect(service.deleteAISeller('unknown')).resolves.toBe(false);
  });
});
