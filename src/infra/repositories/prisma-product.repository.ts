import { Product } from '../../application/domain/product';
import type { ProductChanges, ProductRepository } from '../../application/repositories/product.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toProduct(row: { id: string; name: string; description: string; price: { toNumber(): number } }): Product {
  return new Product(row.id, row.name, row.description, row.price.toNumber());
}

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const row = await this.prisma.product.create({ data: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    } });
    return toProduct(row);
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { id } });
    return row ? toProduct(row) : null;
  }

  async findAll(): Promise<Product[]> {
    return (await this.prisma.product.findMany({ orderBy: { name: 'asc' } })).map(toProduct);
  }

  async update(id: string, changes: ProductChanges): Promise<Product | null> {
    try {
      const row = await this.prisma.product.update({ where: { id }, data: changes });
      return toProduct(row);
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.prisma.product.deleteMany({ where: { id } })).count > 0;
  }
}
