import { Product } from '../../application/domain/product';
import type { ProductChanges, ProductRepository } from '../../application/repositories/product.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toProduct(row: { id: string; name: string; description: string; category: string; price: { toNumber(): number } }): Product {
  return new Product(row.id, row.name, row.description, row.category, row.price.toNumber());
}

const normalizeSearchText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const matchesSearchQuery = (product: Product, name?: string, category?: string): boolean => {
  const normalizedName = normalizeSearchText(name ?? '');
  const normalizedCategory = normalizeSearchText(category ?? '');
  const nameTokens = normalizedName ? normalizedName.split(' ').filter(Boolean) : [];
  const categoryTokens = normalizedCategory ? normalizedCategory.split(' ').filter(Boolean) : [];

  const searchableText = normalizeSearchText(
    `${product.name} ${product.description} ${product.category}`,
  );

  const nameMatches =
    nameTokens.length === 0 ||
    nameTokens.some((token) => token.length > 2 && searchableText.includes(token));
  const categoryMatches =
    categoryTokens.length === 0 ||
    categoryTokens.some((token) => token.length > 2 && searchableText.includes(token));

  return nameMatches && (categoryTokens.length === 0 || categoryMatches || nameMatches);
};

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const row = await this.prisma.product.create({ data: {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
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

  async searchProducts(name?: string, category?: string): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({ orderBy: { name: 'asc' } });
    return rows.map(toProduct).filter((product) => matchesSearchQuery(product, name, category));
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
