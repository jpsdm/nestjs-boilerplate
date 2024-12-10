/**
 * Custom error class to handle cases when an entity is not found.
 */
export class EntityNotFoundError extends Error {
  /**
   * Constructor for the custom error, allowing for a custom message.
   * @param message The error message. Defaults to 'Entity not found.' if not provided.
   */
  constructor(message = 'Entity not found.') {
    super(message); // Calls the parent constructor (Error) with the message
    this.name = 'EntityNotFoundError'; // Sets the error name as 'EntityNotFoundError'
  }
}
