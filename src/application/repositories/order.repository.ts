import type { Order } from '../domain/order';
import type { CrudRepository } from './crud.repository';

export type OrderChanges = Partial<Pick<Order, 'buyer_id' | 'product_id'>>;

export interface OrderRepository extends CrudRepository<Order, OrderChanges> {}
