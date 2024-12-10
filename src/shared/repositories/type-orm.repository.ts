import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Logger } from '@infra/logger';

import {
  TPaginationOptions,
  TPaginationRangeOptions,
  TPaginationResult,
} from '../utils/api-response-data';
import { IContractRepository } from './contract-repository.interface';

/**
 * A generic service for manipulating entities in a database using TypeORM.
 * @template GenericEntity - The type of the entity associated with the repository.
 */
@Injectable()
export class TypeOrmRepository<GenericEntity extends { id: string | number }>
  implements IContractRepository<GenericEntity>
{
  protected readonly repository: Repository<GenericEntity>;
  protected readonly manager: EntityManager;
  protected readonly tableName: string = '';

  /**
   * Initializes the repository with the provided TypeORM repository.
   * @param {Repository<GenericEntity>} repository - The TypeORM repository.
   * @throws {HttpException} Throws an exception if the entity does not have a table name.
   */
  constructor(repository?: Repository<GenericEntity>) {
    this.repository = repository;
    this.manager = this.repository.manager;
    this.tableName = this.repository.metadata.tableName;

    if (!this.tableName) {
      throw new HttpException(`Entity without table name`, HttpStatus.NOT_FOUND);
    }

    this.ensureConnection();
  }

  /**
   * Returns an instance of the repository.
   * @returns {Repository<GenericEntity>} - The repository instance.
   */
  getInstance = (): Repository<GenericEntity> => {
    return this.repository;
  };

  /**
   * Creates a new entity in the database.
   * @param {GenericEntity} entity - The entity to be created.
   * @returns {Promise<GenericEntity>} - The created entity.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async create(entity: GenericEntity): Promise<GenericEntity> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  /**
   * Updates an existing entity in the database.
   * @param {GenericEntity} entity - The entity to be updated.
   * @returns {Promise<GenericEntity>} - The updated entity.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async update(entity: GenericEntity): Promise<GenericEntity> {
    try {
      await this.repository.save(entity);

      const options: FindOneOptions<GenericEntity> = {
        where: { id: entity.id as any } as unknown as FindOptionsWhere<GenericEntity>,
      };

      const result = this.repository.findOne(options);
      return result;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  /**
   * Deletes an entity by ID.
   * @param {string} id - The ID of the entity to be deleted.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async delete(id: string | number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  /**
   * Finds an entity by its ID.
   * @param {string | number} id - The ID of the entity.
   * @returns {Promise<GenericEntity>} - The found entity.
   * @throws {HttpException} Throws an exception if the entity is not found.
   */
  async findById(id: string | number): Promise<GenericEntity> {
    const options: FindOneOptions<GenericEntity> = {
      where: { id } as unknown as FindOptionsWhere<GenericEntity>,
    };

    const entity = await this.repository.findOne(options);

    if (!entity) {
      throw new HttpException(`Entity with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return entity;
  }

  /**
   * Finds an entity by specific conditions.
   * @param {FindOptionsWhere<GenericEntity>} where - The conditions to search for.
   * @returns {Promise<GenericEntity>} - The found entity.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async findOneBy(where: FindOptionsWhere<GenericEntity>): Promise<GenericEntity> {
    try {
      return await this.repository.findOneBy(where);
    } catch (error) {
      this.handleDbError(error);
      throw error;
    }
  }

  /**
   * Finds all entities in the database.
   * @returns {Promise<GenericEntity[]>} - A list of entities.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async findAll(): Promise<GenericEntity[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.handleDbError(error);
      throw error;
    }
  }

  /**
   * Executes a raw SQL query.
   * @param {string} query - The SQL query to execute.
   * @param {any[]} [parameters] - The parameters for the query.
   * @returns {Promise<any>} - The result of the query.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.repository.manager.query(query, parameters);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  /**
   * Paginates the results of an entity with options for sorting, filtering, and field selection.
   * @param {TPaginationOptions<GenericEntity>} options - Pagination options.
   * @param {string[]} fields - The fields to return.
   * @returns {Promise<{ entities: GenericEntity[]; total: number } | null>} - The paginated result.
   * @throws {Error} Throws a database error if the operation fails.
   */
  async paginate(
    options: TPaginationOptions<GenericEntity> = {},
    fields: string[] = [],
  ): Promise<{ entities: GenericEntity[]; total: number } | null> {
    const { limit = 10, page = 1, sort = null, order = null, where = {} } = options;
    const skip = (page - 1) * limit;
    const selectedFields = Array.isArray(fields) && fields.length > 0 ? fields : undefined;

    let query = this.repository.createQueryBuilder(this.tableName);

    if (selectedFields) {
      query = query.select(selectedFields.map((field) => `${this.tableName}.${field}`));
    }

    query = query.skip(skip).take(limit);

    if (Object.keys(where).length > 0) {
      query = query.where(where);
    }

    const total = await query.getCount();

    if (total === 0) {
      return { entities: [], total };
    }

    if (sort) {
      query = query.orderBy(`${this.tableName}.${sort}`, order ?? 'ASC');
    }

    const entities = await query.getMany();

    return { entities, total };
  }

  /**
   * Ensures that the database connection is active.
   * @throws {Error} Throws an error if the connection cannot be initialized.
   */
  async ensureConnection(): Promise<void> {
    const { isInitialized } = this.manager.connection;

    if (!isInitialized) {
      try {
        await this.repository.manager.connection.initialize();
        Logger.info('Database connection reinitialized.');
      } catch (error) {
        Logger.error('Database connection error.', error);
        this.handleDbError(error);
      }
    }
  }

  /**
   * Returns pagination information based on intervals.
   * @param {TPaginationRangeOptions} options - Pagination range options.
   * @returns {TPaginationResult} - Pagination results.
   */
  paginateRange({ total, limit = 10, page = 1 }: TPaginationRangeOptions): TPaginationResult {
    const totalPages = Math.ceil(total / limit);

    return {
      totalItems: total,
      totalPages,
      currentPage: +page,
      itemsPerPage: limit,
    };
  }

  /**
   * Handles database errors by logging them and throwing appropriate exceptions.
   * @param {Error} error - The error to handle.
   * @throws {Error} Throws a formatted error message.
   */
  handleDbError(error: Error): void {
    const msg = `Database error: ${error.message}`;
    Logger.error(msg, error);
    throw new Error(msg);
  }
}
