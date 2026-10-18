import type { Buyer } from '../domain/buyer';
import type { CrudRepository } from './crud.repository';

export type BuyerChanges = Partial<Pick<Buyer, 'name' | 'balance'>>;

export interface BuyerRepository extends CrudRepository<Buyer, BuyerChanges> {}
