import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter for handling all exceptions in the application.
 *
 * This filter catches and processes exceptions thrown during request handling.
 * It standardizes error responses, ensuring consistency across the application.
 *
 * @implements {ExceptionFilter}
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Handles exceptions thrown by the application and formats the response.
   *
   * @param {unknown} exception - The exception thrown by the application.
   * @param {ArgumentsHost} host - The host object containing request and response context.
   *
   * This method determines the type of exception and constructs a standardized
   * error response containing the HTTP status, message, validation errors, and other metadata.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default status and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let validationErrors: any[] = [];

    // Handle HttpException types
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle BadRequestException and extract validation errors
      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        message = 'Bad Request Exception';
        const responseBody = exceptionResponse as Record<string, any>;

        // Format validation errors
        if (Array.isArray(responseBody.message)) {
          validationErrors = responseBody.message.map((error) => {
            if (typeof error === 'object' && 'property' in error && 'constraints' in error) {
              return {
                field: error.property,
                errors: Object.values(error.constraints),
              };
            }
            return error;
          });
        }
      } else {
        // Fallback for non-validation errors
        message = typeof exceptionResponse === 'string' ? exceptionResponse : exception.message;
      }
    }
    // Handle custom structured error objects
    else if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      'message' in exception &&
      'status' in exception &&
      exception['status'] === 'error'
    ) {
      const errorResponse = exception as Record<string, any>;
      status = errorResponse.statusCode;
      message = errorResponse.message;
      validationErrors = errorResponse.validationErrors || [];
    }

    // Send standardized JSON error response
    response.status(status).json({
      status: 'error',
      statusCode: status,
      message,
      validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
