import { Buyer } from '../../application/domain/buyer';
import type { BuyerChanges, BuyerRepository } from '../../application/repositories/buyer.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toBuyer(row: { id: string; name: string; balance: { toNumber(): number } }): Buyer {
  return new Buyer(row.id, row.name, row.balance.toNumber());
}

export class PrismaBuyerRepository implements BuyerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(buyer: Buyer): Promise<Buyer> {
    return toBuyer(await this.prisma.buyer.create({ data: {
      id: buyer.id,
      name: buyer.name,
      balance: buyer.balance,
    } }));
  }

  async findById(id: string): Promise<Buyer | null> {
    const row = await this.prisma.buyer.findUnique({ where: { id } });
    return row ? toBuyer(row) : null;
  }

  async findAll(): Promise<Buyer[]> {
    return (await this.prisma.buyer.findMany({ orderBy: { name: 'asc' } })).map(toBuyer);
  }

  async update(id: string, changes: BuyerChanges): Promise<Buyer | null> {
    try {
      return toBuyer(await this.prisma.buyer.update({ where: { id }, data: changes }));
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.prisma.buyer.deleteMany({ where: { id } })).count > 0;
  }
}
