import { v4 as uuidv4 } from 'uuid';

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  static create(name: string, description: string, price: number) {
    const id = uuidv4();
    return new Product(id, name, description, price);
  }
}
