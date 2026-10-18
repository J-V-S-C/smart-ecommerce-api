import { Product } from '../domain/product';
import type { ProductChanges, ProductRepository } from '../repositories/product.repository';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
}

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct({ name, description, price }: CreateProductInput): Promise<string> {
    const product = Product.create(name, description, price);
    await this.productRepository.create(product);
    return product.id;
  }

  findProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  listProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  updateProduct(id: string, changes: ProductChanges): Promise<Product | null> {
    return this.productRepository.update(id, changes);
  }

  deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
