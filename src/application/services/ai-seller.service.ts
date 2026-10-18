import { AISeller } from '../domain/ai_seller';
import type { AISellerChanges, AISellerRepository } from '../repositories/ai-seller.repository';

export interface CreateAISellerInput {
  seller_id: string;
  product_id: string;
}

export class AISellerService {
  constructor(private aiSellerRepository: AISellerRepository) {}

  async createAISeller({ seller_id, product_id }: CreateAISellerInput): Promise<string> {
    const aiSeller = AISeller.create(seller_id, product_id);
    await this.aiSellerRepository.create(aiSeller);
    return aiSeller.id;
  }

  findAISellerById(id: string): Promise<AISeller | null> {
    return this.aiSellerRepository.findById(id);
  }

  listAISellers(): Promise<AISeller[]> {
    return this.aiSellerRepository.findAll();
  }

  updateAISeller(id: string, changes: AISellerChanges): Promise<AISeller | null> {
    return this.aiSellerRepository.update(id, changes);
  }

  deleteAISeller(id: string): Promise<boolean> {
    return this.aiSellerRepository.delete(id);
  }
}
