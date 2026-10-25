import type { Product } from '../../domain/product';
import type { ProductChanges, ProductRepository } from '../product.repository';

const normalizeSearchText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export class InMemoryProductRepository implements ProductRepository {
  public products: Product[] = [];

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async searchProducts(name?: string, category?: string): Promise<Product[]> {
    const normalizedName = normalizeSearchText(name ?? '');
    const normalizedCategory = normalizeSearchText(category ?? '');
    const nameTokens = normalizedName
      ? normalizedName.split(' ').filter(Boolean)
      : [];
    const categoryTokens = normalizedCategory
      ? normalizedCategory.split(' ').filter(Boolean)
      : [];

    return this.products.filter((product) => {
      const productText = normalizeSearchText(
        `${product.name} ${product.description} ${product.category}`,
      );

      const nameMatches =
        nameTokens.length === 0 ||
        nameTokens.some(
          (token) => token.length > 2 && productText.includes(token),
        );
      const categoryMatches =
        categoryTokens.length === 0 ||
        categoryTokens.some(
          (token) => token.length > 2 && productText.includes(token),
        );

      return (
        nameMatches &&
        (categoryTokens.length === 0 || categoryMatches || nameMatches)
      );
    });
  }

  async update(id: string, changes: ProductChanges): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;
    Object.assign(product, changes);
    return product;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Compatibilidade com o contrato usado antes da expansão do CRUD.
  async save(product: Product): Promise<void> {
    await this.create(product);
  }

  async getByID(id: string): Promise<Product | null> {
    return this.findById(id);
  }
}
