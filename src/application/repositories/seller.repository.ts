import type { Seller } from '../domain/seller';
import type { CrudRepository } from './crud.repository';

export type SellerChanges = Partial<Pick<Seller, 'name' | 'product_ids'>>;

export interface SellerRepository extends CrudRepository<Seller, SellerChanges> {}
