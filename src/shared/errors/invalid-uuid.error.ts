/**
 * Custom error class to handle invalid UUID instances.
 */
export class InvalidUuidError extends Error {
  /**
   * Constructor for the custom error, allowing for a custom message.
   * @param message The error message. Defaults to 'The instance of the object is invalid.' if not provided.
   */
  constructor(message = 'The instance of the object is invalid.') {
    super(message); // Calls the parent constructor (Error) with the message
    this.name = 'InvalidUuidError'; // Sets the error name as 'InvalidUuidError'
  }
}
