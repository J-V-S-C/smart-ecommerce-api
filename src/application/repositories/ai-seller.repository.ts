import type { AISeller } from '../domain/ai_seller';
import type { CrudRepository } from './crud.repository';

export type AISellerChanges = Partial<Pick<AISeller, 'seller_id' | 'product_id'>>;

export interface AISellerRepository extends CrudRepository<AISeller, AISellerChanges> {}
