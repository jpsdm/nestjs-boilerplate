import { FindOptionsWhere } from 'typeorm';
import { C_E_COLUMN_ORDER } from '../constants';

/**
 * Pagination options for generic queries.
 * Defines options such as filtering, sorting, and pagination controls.
 * @template GenericEntity - The type of the entity being queried.
 */
export type TPaginationOptions<GenericEntity> = {
  /** Filter conditions to apply to the query. Can be an object or a string. */
  where?: FindOptionsWhere<GenericEntity> | string;

  /** Field to sort the results by. */
  sort?: string;

  /** Order in which to sort the results. */
  order?: C_E_COLUMN_ORDER;

  /** Maximum number of results per page. */
  limit?: number;

  /** Page number for pagination. */
  page?: number;
};

/**
 * Standard result structure for pagination.
 * Represents metadata for paginated results, such as total items, pages, and the current page.
 */
export type TPaginationResult = {
  /** Total number of items across all pages. */
  totalItems: number;

  /** Total number of pages based on the total items and items per page. */
  totalPages: number;

  /** The current page number. */
  currentPage: number;

  /** Number of items per page. */
  itemsPerPage: number;
};

/**
 * Options for calculating pagination ranges.
 * Used to calculate ranges for pagination, including total items, limit, and page.
 */
export type TPaginationRangeOptions = {
  /** Total number of items. */
  total: number;

  /** Maximum number of items per page. */
  limit?: number;

  /** Current page number. */
  page?: number;

  /** Base path for constructing pagination URLs. */
  basePath?: string | null;
};

/**
 * Standard structure for API responses.
 * Represents the response format for API calls, including data, pagination, status, HTTP code, and message.
 * @template T - The type of the data being returned in the response.
 */
export type TResponseData<T> = {
  /** The data returned by the API, which can be a single object or an array. */
  data: T | T[];

  /** Optional pagination information for the response. */
  pagination?: TPaginationResult;

  /** The status of the response, either 'success' or 'error'. */
  status: 'success' | 'error';

  /** The HTTP status code of the response. */
  statusCode: number;

  /** A descriptive message about the result of the operation. */
  message: string;

  /** Optional list of validation errors, if any. */
  validationErrors?: string[] | Record<string, any>[];
};

/**
 * Namespace for managing standardized API responses.
 * Provides utility functions to generate standardized responses for both success and error cases.
 */
export namespace ApiResponseData {
  /**
   * Generates a success response.
   * @param {Object} params - The parameters for generating the success response.
   * @param {T | T[] | null} params.data - The data returned by the API.
   * @param {TPaginationResult} [params.pagination] - Optional pagination information.
   * @param {string} [params.message='Operation successful'] - Optional message for the response.
   * @param {number} [params.statusCode=200] - Optional HTTP status code (default: 200).
   * @returns {TResponseData<T>} - The success response data.
   */
  export function success<T>({
    data,
    pagination,
    message = 'Operation successful',
    statusCode = 200,
  }: {
    data: T | T[] | null;
    pagination?: TPaginationResult;
    message?: string;
    statusCode?: number;
  }): TResponseData<T> {
    return {
      data,
      status: 'success',
      statusCode,
      message,
      pagination,
    };
  }

  /**
   * Generates an error response.
   * @param {Object} params - The parameters for generating the error response.
   * @param {string} [params.message='An error occurred'] - The error message.
   * @param {number} [params.statusCode=500] - The HTTP status code for the error (default: 500).
   * @param {string[] | Record<string, any>[]} [params.validationErrors] - Optional list of validation errors.
   * @returns {TResponseData<null>} - The error response data.
   */
  export function error({
    message = 'An error occurred',
    statusCode = 500,
    validationErrors = [],
  }: {
    message?: string;
    statusCode?: number;
    validationErrors?: string[] | Record<string, any>[];
  } = {}): TResponseData<null> {
    return {
      data: null,
      status: 'error',
      statusCode,
      message,
      pagination: null,
      validationErrors,
    };
  }
}
