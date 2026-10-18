export interface CrudRepository<TEntity, TUpdate> {
  create(entity: TEntity): Promise<TEntity>;
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
  update(id: string, changes: TUpdate): Promise<TEntity | null>;
  delete(id: string): Promise<boolean>;
}
