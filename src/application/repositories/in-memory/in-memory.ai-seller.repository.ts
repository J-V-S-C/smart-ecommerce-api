import type { AISeller } from '../../domain/ai_seller';
import type { AISellerChanges, AISellerRepository } from '../ai-seller.repository';

export class InMemoryAISellerRepository implements AISellerRepository {
  public aiSellers: AISeller[] = [];

  async create(aiSeller: AISeller): Promise<AISeller> {
    this.aiSellers.push(aiSeller);
    return aiSeller;
  }

  async findById(id: string): Promise<AISeller | null> {
    return this.aiSellers.find((aiSeller) => aiSeller.id === id) ?? null;
  }

  async findAll(): Promise<AISeller[]> {
    return [...this.aiSellers];
  }

  async update(id: string, changes: AISellerChanges): Promise<AISeller | null> {
    const aiSeller = await this.findById(id);
    if (!aiSeller) return null;
    Object.assign(aiSeller, changes);
    return aiSeller;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.aiSellers.findIndex((aiSeller) => aiSeller.id === id);
    if (index === -1) return false;
    this.aiSellers.splice(index, 1);
    return true;
  }
}
