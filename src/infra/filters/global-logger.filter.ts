import { Logger } from '@infra/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

/**
 * Global logger filter for logging exceptions in the application.
 *
 * @implements {ExceptionFilter}
 *
 * This filter logs details of exceptions that occur within the application, including request information, exception details, and error messages.
 * It also sends a formatted error response with the appropriate status code.
 */
@Catch()
@Injectable()
export class GlobalLoggerFilter implements ExceptionFilter {
  /**
   * Catches an exception and logs the error details while sending a response to the client.
   *
   * @param {any} exception - The exception that was thrown in the application.
   * @param {ArgumentsHost} host - The host containing the request and response objects.
   *
   * @returns {void} This method doesn't return a value; it logs the error and sends a response.
   *
   * This method handles the logging of exceptions, extracting relevant details such as request method, URL, IP, body, and exception message.
   * It logs the exception using the `Logger` service and sends a JSON response to the client with the status, timestamp, and error message.
   */
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    if (host.getType<any>() === 'http') {
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      const logDetails = this.extractLogDetails(request, exception);

      // Log the error using the Logger service
      Logger.info(logDetails.error, exception);

      // Send the error response to the client
      response.status(logDetails.status).json({
        timestamp: new Date().toISOString(),
        path: request.path,
        error: logDetails.error,
      });
    }
  }

  /**
   * Extracts the relevant details for logging the exception.
   *
   * @param {any} request - The incoming HTTP request object.
   * @param {any} exception - The exception that was thrown.
   *
   * @returns {object} An object containing log details such as status, error message, and request information.
   *
   * This method formats the error and request details, including the request method, URL, IP address, and user agent, for logging purposes.
   */
  private extractLogDetails(request: any, exception: any) {
    const { ip, method, path: url, body } = request;
    const userAgent = request.get('user-agent') || '';

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception instanceof HttpException ? exception.getResponse() : exception;

    const logError = this.formatError(errorResponse);

    return {
      error: logError,
      status,
      message: {
        requestMethod: method,
        url,
        agent: userAgent,
        ip,
        status,
        error: logError,
        body: JSON.stringify(body),
      },
    };
  }

  /**
   * Formats the error into a string for logging purposes.
   *
   * @param {any} error - The error response object to format.
   *
   * @returns {string} A string representation of the error.
   *
   * This method ensures the error is in a format suitable for logging, checking if it's a string or an object with a message.
   */
  private formatError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    return typeof error.message === 'object' ? error.message[0] : error.message && error.message;
  }
}
