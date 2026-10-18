import type { Buyer } from '../../domain/buyer';
import type { BuyerChanges, BuyerRepository } from '../buyer.repository';

export class InMemoryBuyerRepository implements BuyerRepository {
  public buyers: Buyer[] = [];

  async create(buyer: Buyer): Promise<Buyer> {
    this.buyers.push(buyer);
    return buyer;
  }

  async findById(id: string): Promise<Buyer | null> {
    return this.buyers.find((buyer) => buyer.id === id) ?? null;
  }

  async findAll(): Promise<Buyer[]> {
    return [...this.buyers];
  }

  async update(id: string, changes: BuyerChanges): Promise<Buyer | null> {
    const buyer = await this.findById(id);
    if (!buyer) return null;
    Object.assign(buyer, changes);
    return buyer;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.buyers.findIndex((buyer) => buyer.id === id);
    if (index === -1) return false;
    this.buyers.splice(index, 1);
    return true;
  }
}
