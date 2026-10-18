import { v4 as uuidv4 } from 'uuid';

export class Order {
  constructor(
    public readonly id: string,
    public buyer_id: string,
    public product_id: string,
  ) {}

  static create(buyer_id: string, product_id: string): Order {
    return new Order(uuidv4(), buyer_id, product_id);
  }
}
