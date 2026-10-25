import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryProductRepository } from '../../../src/application/repositories/in-memory/in-memory.product.repository';
import { ProductService } from '../../../src/application/services/product.service';

describe('ProductService', () => {
  let repository: InMemoryProductRepository;
  let service: ProductService;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    service = new ProductService(repository);
  });

  it('creates and persists a product', async () => {
    const id = await service.createProduct({
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      category: 'peripherals',
      price: 250,
    });

    expect(id).toEqual(expect.any(String));
    await expect(service.findProductById(id)).resolves.toMatchObject({
      id,
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 250,
    });
  });

  it('finds an existing product and returns null for an unknown id', async () => {
    const id = await service.createProduct({ name: 'Mouse', description: 'Wireless mouse', category: 'peripherals', price: 90 });

    await expect(service.findProductById(id)).resolves.toMatchObject({ name: 'Mouse' });
    await expect(service.findProductById('unknown')).resolves.toBeNull();
  });

  it('lists all products', async () => {
    await service.createProduct({ name: 'Mouse', description: 'Wireless mouse', category: 'peripherals', price: 90 });
    await service.createProduct({ name: 'Monitor', description: '27 inch monitor', category: 'displays', price: 1200 });

    await expect(service.listProducts()).resolves.toEqual([
      expect.objectContaining({ name: 'Mouse' }),
      expect.objectContaining({ name: 'Monitor' }),
    ]);
  });

  it('matches natural-language product searches even when the category is not an exact catalog value', async () => {
    await service.createProduct({
      name: 'Óculos de Sol',
      description: 'Lentes polarizadas e proteção UV400',
      category: 'acessorios',
      price: 149.9,
    });

    await expect(
      service.searchProducts('óculos de sol baratos', 'óculos de sol'),
    ).resolves.toEqual([
      expect.objectContaining({ name: 'Óculos de Sol', category: 'acessorios', price: 149.9 }),
    ]);
  });

  it('updates an existing product and returns null for an unknown id', async () => {
    const id = await service.createProduct({ name: 'Monitor', description: 'Full HD', category: 'displays', price: 900 });

    await expect(service.updateProduct(id, { description: '4K', price: 1500 })).resolves.toMatchObject({
      id,
      name: 'Monitor',
      description: '4K',
      price: 1500,
    });
    await expect(service.updateProduct('unknown', { price: 1 })).resolves.toBeNull();
  });

  it('deletes an existing product and returns false for an unknown id', async () => {
    const id = await service.createProduct({ name: 'Headset', description: 'USB headset', category: 'peripherals', price: 180 });

    await expect(service.deleteProduct(id)).resolves.toBe(true);
    await expect(service.findProductById(id)).resolves.toBeNull();
    await expect(service.deleteProduct('unknown')).resolves.toBe(false);
  });
});
