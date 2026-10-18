import { Seller } from '../domain/seller';
import type { SellerChanges, SellerRepository } from '../repositories/seller.repository';

export interface CreateSellerInput {
  name: string;
  product_ids: string[];
}

export class SellerService {
  constructor(private sellerRepository: SellerRepository) {}

  async createSeller({ name, product_ids }: CreateSellerInput): Promise<string> {
    const seller = Seller.create(name, product_ids);
    await this.sellerRepository.create(seller);
    return seller.id;
  }

  findSellerById(id: string): Promise<Seller | null> {
    return this.sellerRepository.findById(id);
  }

  listSellers(): Promise<Seller[]> {
    return this.sellerRepository.findAll();
  }

  updateSeller(id: string, changes: SellerChanges): Promise<Seller | null> {
    return this.sellerRepository.update(id, changes);
  }

  deleteSeller(id: string): Promise<boolean> {
    return this.sellerRepository.delete(id);
  }
}
