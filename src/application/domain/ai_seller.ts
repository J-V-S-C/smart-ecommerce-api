import { v4 as uuidv4 } from 'uuid';

export class AISeller {
  constructor(
    public readonly id: string,
    public seller_id: string,
    public product_id: string,
  ) {}

  static create(seller_id: string, product_id: string): AISeller {
    return new AISeller(uuidv4(), seller_id, product_id);
  }
}
