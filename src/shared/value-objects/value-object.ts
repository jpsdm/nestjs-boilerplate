/**
 * Abstract class representing a value object.
 *
 * A value object is an object that represents a concept or a value. It is immutable and has no identity,
 * and its equality is based on the value it holds rather than a unique identifier.
 */
export default abstract class ValueObject<Value = string> {
  /**
   * The value stored in the value object. It is immutable.
   *
   * @protected
   */
  protected readonly _value: Value;

  /**
   * Creates an instance of the ValueObject.
   *
   * The value is immutable and is frozen upon initialization to ensure immutability.
   *
   * @param {Value} value - The value to be stored in the value object.
   */
  protected constructor(value: Value) {
    this._value = Object.freeze(value); // Freeze to ensure immutability
  }

  /**
   * Gets the value stored in the value object.
   *
   * @returns {Value} - The stored value.
   */
  get value(): Value {
    return this._value;
  }

  /**
   * Converts the value object to a string representation.
   *
   * If the value is an object, it will be stringified using JSON.stringify. Otherwise, the value will be
   * converted to a string using its `toString` method.
   *
   * @returns {string} - The string representation of the value object.
   */
  toString: () => string = (): string => {
    if (typeof this._value === 'object') {
      return JSON.stringify(this._value); // Convert object to JSON string
    }

    return this._value.toString(); // Convert primitive value to string
  };
}
