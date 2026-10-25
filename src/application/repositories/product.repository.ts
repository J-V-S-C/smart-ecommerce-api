import type { Product } from '../domain/product';
import type { CrudRepository } from './crud.repository';

export type ProductChanges = Partial<Pick<Product, 'name' | 'description' | 'category' | 'price'>>;

export interface ProductRepository extends CrudRepository<Product, ProductChanges> {
  searchProducts(name?: string, category?: string): Promise<Product[]>;
}
