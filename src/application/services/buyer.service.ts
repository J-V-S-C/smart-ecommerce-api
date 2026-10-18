import { Buyer } from '../domain/buyer';
import type { BuyerChanges, BuyerRepository } from '../repositories/buyer.repository';

export interface CreateBuyerInput {
  name: string;
  balance: number;
}

export class BuyerService {
  constructor(private buyerRepository: BuyerRepository) {}

  async createBuyer({ name, balance }: CreateBuyerInput): Promise<string> {
    const buyer = Buyer.create(name, balance);
    await this.buyerRepository.create(buyer);
    return buyer.id;
  }

  findBuyerById(id: string): Promise<Buyer | null> {
    return this.buyerRepository.findById(id);
  }

  listBuyers(): Promise<Buyer[]> {
    return this.buyerRepository.findAll();
  }

  updateBuyer(id: string, changes: BuyerChanges): Promise<Buyer | null> {
    return this.buyerRepository.update(id, changes);
  }

  deleteBuyer(id: string): Promise<boolean> {
    return this.buyerRepository.delete(id);
  }
}
