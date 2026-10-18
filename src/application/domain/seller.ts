import { v4 as uuidv4 } from 'uuid';

export class Seller {
  constructor(
    public readonly id: string,
    public name: string,
    public product_ids: string[],
  ) {}

  static create(name: string, product_ids: string[]): Seller {
    return new Seller(uuidv4(), name, product_ids);
  }
}
