import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryBuyerRepository } from '../../../src/application/repositories/in-memory/in-memory.buyer.repository';
import { BuyerService } from '../../../src/application/services/buyer.service';

describe('BuyerService', () => {
  let repository: InMemoryBuyerRepository;
  let service: BuyerService;

  beforeEach(() => {
    repository = new InMemoryBuyerRepository();
    service = new BuyerService(repository);
  });

  it('creates and persists a buyer', async () => {
    const id = await service.createBuyer({ name: 'Joana', balance: 500 });

    expect(id).toEqual(expect.any(String));
    await expect(service.findBuyerById(id)).resolves.toMatchObject({ id, name: 'Joana', balance: 500 });
  });

  it('finds an existing buyer and returns null for an unknown id', async () => {
    const id = await service.createBuyer({ name: 'Carlos', balance: 100 });

    await expect(service.findBuyerById(id)).resolves.toMatchObject({ name: 'Carlos' });
    await expect(service.findBuyerById('unknown')).resolves.toBeNull();
  });

  it('lists all buyers', async () => {
    await service.createBuyer({ name: 'Joana', balance: 500 });
    await service.createBuyer({ name: 'Carlos', balance: 100 });

    await expect(service.listBuyers()).resolves.toEqual([
      expect.objectContaining({ name: 'Joana' }),
      expect.objectContaining({ name: 'Carlos' }),
    ]);
  });

  it('updates an existing buyer and returns null for an unknown id', async () => {
    const id = await service.createBuyer({ name: 'Joana', balance: 500 });

    await expect(service.updateBuyer(id, { name: 'Joana Silva', balance: 750 })).resolves.toMatchObject({
      id,
      name: 'Joana Silva',
      balance: 750,
    });
    await expect(service.updateBuyer('unknown', { balance: 1 })).resolves.toBeNull();
  });

  it('deletes an existing buyer and returns false for an unknown id', async () => {
    const id = await service.createBuyer({ name: 'Joana', balance: 500 });

    await expect(service.deleteBuyer(id)).resolves.toBe(true);
    await expect(service.findBuyerById(id)).resolves.toBeNull();
    await expect(service.deleteBuyer('unknown')).resolves.toBe(false);
  });
});
