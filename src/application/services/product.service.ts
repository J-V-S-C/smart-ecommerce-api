import { Product } from '../domain/product';
import type { ProductChanges, ProductRepository } from '../repositories/product.repository';

export interface CreateProductInput {
  name: string;
  description: string;
  category: string;
  price: number;
}

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct({ name, description, category, price }: CreateProductInput): Promise<string> {
    const product = Product.create(name, description, category, price);
    await this.productRepository.create(product);
    return product.id;
  }

  findProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  listProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  searchProducts(name?: string, category?: string): Promise<Product[]> {
    return this.productRepository.searchProducts(name, category);
  }

  updateProduct(id: string, changes: ProductChanges): Promise<Product | null> {
    return this.productRepository.update(id, changes);
  }

  deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
