import { InvalidUuidError } from '@shared/errors';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';
import ValueObject from './value-object';

/**
 * Represents a unique entity identifier as a value object.
 *
 * This class is responsible for ensuring that the provided identifier is a valid UUID.
 * If no identifier is provided, a new UUID will be generated. The identifier is validated upon construction.
 */
export default class UniqueEntityId extends ValueObject<string | null> {
  /**
   * Creates an instance of UniqueEntityId.
   *
   * If an ID is provided, it is validated. If no ID is provided, a new UUID is generated and validated.
   *
   * @param {string | null} [id] - The unique identifier (UUID) to be used. If not provided, a new UUID will be generated.
   */
  constructor(id?: string | null) {
    super(id ?? uuidV4()); // If no ID is provided, generate a new UUID
    this.validateId(); // Validate the generated or provided ID
  }

  /**
   * Validates the unique entity ID to ensure it is a valid UUID.
   *
   * If the ID is not a valid UUID, an InvalidUuidError is thrown.
   *
   * @throws {InvalidUuidError} - If the ID is not a valid UUID.
   */
  private validateId(): void {
    const isValid: boolean = uuidValidate(this._value);

    if (!isValid) {
      throw new InvalidUuidError(); // Throws error if ID is invalid
    }
  }
}
