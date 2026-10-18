import { v4 as uuidv4 } from 'uuid';

export class Buyer {
  constructor(
    public readonly id: string,
    public name: string,
    public balance: number,
  ) {}

  static create(name: string, balance: number): Buyer {
    return new Buyer(uuidv4(), name, balance);
  }
}
