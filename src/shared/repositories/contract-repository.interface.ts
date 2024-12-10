import { UniqueEntityId } from '@shared/value-objects';

/**
 * Interface for a contract repository that manages entities.
 * @template GenericEntity - The type of the entity managed by the repository.
 */
export interface IContractRepository<GenericEntity> {
  /**
   * Creates a new entity.
   * @param {GenericEntity} entity - The entity to be created.
   * @returns {Promise<GenericEntity>} - The created entity.
   */
  create(entity: GenericEntity): Promise<GenericEntity>;

  /**
   * Updates an existing entity.
   * @param {GenericEntity} entity - The entity to be updated.
   * @returns {Promise<GenericEntity>} - The updated entity.
   */
  update(entity: GenericEntity): Promise<GenericEntity>;

  /**
   * Deletes an entity by its ID.
   * @param {string | number | UniqueEntityId} id - The ID of the entity to delete.
   * @returns {Promise<void>} - Void result after deletion.
   */
  delete(id: string | number | UniqueEntityId): Promise<void>;

  /**
   * Finds an entity by its ID.
   * @param {string | number | UniqueEntityId} id - The ID of the entity to find.
   * @returns {Promise<GenericEntity>} - The found entity.
   */
  findById(id: string | number | UniqueEntityId): Promise<GenericEntity>;

  /**
   * Retrieves all entities.
   * @returns {Promise<GenericEntity[]>} - A list of all entities.
   */
  findAll(): Promise<GenericEntity[]>;
}
