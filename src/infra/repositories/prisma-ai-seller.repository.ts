import { AISeller } from '../../application/domain/ai_seller';
import type { AISellerChanges, AISellerRepository } from '../../application/repositories/ai-seller.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toAISeller(row: { id: string; sellerId: string; productId: string }): AISeller {
  return new AISeller(row.id, row.sellerId, row.productId);
}

export class PrismaAISellerRepository implements AISellerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(aiSeller: AISeller): Promise<AISeller> {
    return toAISeller(await this.prisma.aISeller.create({ data: {
      id: aiSeller.id,
      sellerId: aiSeller.seller_id,
      productId: aiSeller.product_id,
    } }));
  }

  async findById(id: string): Promise<AISeller | null> {
    const row = await this.prisma.aISeller.findUnique({ where: { id } });
    return row ? toAISeller(row) : null;
  }

  async findAll(): Promise<AISeller[]> {
    return (await this.prisma.aISeller.findMany({ orderBy: { id: 'asc' } })).map(toAISeller);
  }

  async update(id: string, changes: AISellerChanges): Promise<AISeller | null> {
    try {
      return toAISeller(await this.prisma.aISeller.update({
        where: { id },
        data: { sellerId: changes.seller_id, productId: changes.product_id },
      }));
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.prisma.aISeller.deleteMany({ where: { id } })).count > 0;
  }
}
