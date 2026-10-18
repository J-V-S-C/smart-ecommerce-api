import { Seller } from '../../application/domain/seller';
import type { SellerChanges, SellerRepository } from '../../application/repositories/seller.repository';
import type { PrismaClient } from '../../generated/prisma/client';
import { isMissingRecord } from '../db/prisma-errors';

function toSeller(row: { id: string; name: string; products: { id: string }[] }): Seller {
  return new Seller(row.id, row.name, row.products.map((product) => product.id));
}

export class PrismaSellerRepository implements SellerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(seller: Seller): Promise<Seller> {
    return toSeller(await this.prisma.seller.create({
      data: {
        id: seller.id,
        name: seller.name,
        products: { connect: seller.product_ids.map((id) => ({ id })) },
      },
      include: { products: { select: { id: true } } },
    }));
  }

  async findById(id: string): Promise<Seller | null> {
    const row = await this.prisma.seller.findUnique({
      where: { id }, include: { products: { select: { id: true } } },
    });
    return row ? toSeller(row) : null;
  }

  async findAll(): Promise<Seller[]> {
    return (await this.prisma.seller.findMany({
      include: { products: { select: { id: true } } }, orderBy: { name: 'asc' },
    })).map(toSeller);
  }

  async update(id: string, changes: SellerChanges): Promise<Seller | null> {
    try {
      return toSeller(await this.prisma.seller.update({
        where: { id },
        data: {
          name: changes.name,
          products: changes.product_ids === undefined
            ? undefined
            : { set: changes.product_ids.map((productId) => ({ id: productId })) },
        },
        include: { products: { select: { id: true } } },
      }));
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.prisma.seller.deleteMany({ where: { id } })).count > 0;
  }
}
