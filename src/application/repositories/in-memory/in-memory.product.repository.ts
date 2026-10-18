import type { Product } from '../../domain/product';
import type { ProductChanges, ProductRepository } from '../product.repository';

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
