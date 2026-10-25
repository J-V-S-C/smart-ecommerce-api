import { beforeEach, describe, expect, it } from 'vitest';
import { InMemorySellerRepository } from '../../../src/application/repositories/in-memory/in-memory.seller.repository';
import { SellerService } from '../../../src/application/services/seller.service';

describe('SellerService', () => {
  let repository: InMemorySellerRepository;
  let service: SellerService;

  beforeEach(() => {
    repository = new InMemorySellerRepository();
    service = new SellerService(repository);
  });

  it('creates and persists a seller', async () => {
    const id = await service.createSeller({ name: 'Store A', product_ids: ['product-1'] });

    expect(id).toEqual(expect.any(String));
    await expect(service.findSellerById(id)).resolves.toMatchObject({
      id,
      name: 'Store A',
      product_ids: ['product-1'],
    });
  });

  it('finds an existing seller and returns null for an unknown id', async () => {
    const id = await service.createSeller({ name: 'Store A', product_ids: [] });

    await expect(service.findSellerById(id)).resolves.toMatchObject({ name: 'Store A' });
    await expect(service.findSellerById('unknown')).resolves.toBeNull();
  });

  it('lists all sellers', async () => {
    await service.createSeller({ name: 'Store A', product_ids: [] });
    await service.createSeller({ name: 'Store B', product_ids: ['product-1'] });

    await expect(service.listSellers()).resolves.toEqual([
      expect.objectContaining({ name: 'Store A' }),
      expect.objectContaining({ name: 'Store B' }),
    ]);
  });

  it('updates an existing seller and returns null for an unknown id', async () => {
    const id = await service.createSeller({ name: 'Store A', product_ids: ['product-1'] });

    await expect(service.updateSeller(id, { name: 'Store A+', product_ids: ['product-2'] })).resolves.toMatchObject({
      id,
      name: 'Store A+',
      product_ids: ['product-2'],
    });
    await expect(service.updateSeller('unknown', { name: 'Missing' })).resolves.toBeNull();
  });

  it('deletes an existing seller and returns false for an unknown id', async () => {
    const id = await service.createSeller({ name: 'Store A', product_ids: [] });

    await expect(service.deleteSeller(id)).resolves.toBe(true);
    await expect(service.findSellerById(id)).resolves.toBeNull();
    await expect(service.deleteSeller('unknown')).resolves.toBe(false);
  });
});
