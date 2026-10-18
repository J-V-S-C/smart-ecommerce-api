import type { Seller } from '../../domain/seller';
import type { SellerChanges, SellerRepository } from '../seller.repository';

export class InMemorySellerRepository implements SellerRepository {
  public sellers: Seller[] = [];

  async create(seller: Seller): Promise<Seller> {
    this.sellers.push(seller);
    return seller;
  }

  async findById(id: string): Promise<Seller | null> {
    return this.sellers.find((seller) => seller.id === id) ?? null;
  }

  async findAll(): Promise<Seller[]> {
    return [...this.sellers];
  }

  async update(id: string, changes: SellerChanges): Promise<Seller | null> {
    const seller = await this.findById(id);
    if (!seller) return null;
    Object.assign(seller, changes);
    return seller;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.sellers.findIndex((seller) => seller.id === id);
    if (index === -1) return false;
    this.sellers.splice(index, 1);
    return true;
  }
}
