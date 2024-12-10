import { Logger } from '@infra/logger';
import { CustomError } from '@infra/logger/logger.module';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware for logging incoming requests and outgoing responses.
 *
 * This middleware logs details of incoming HTTP requests and outgoing responses. It records the request method,
 * URL, headers, body, and other relevant information, and logs the response status, duration, and any errors.
 */
@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  /**
   * Middleware function to log request and response details.
   *
   * @param {Request} request - The incoming request object.
   * @param {Response} response - The outgoing response object.
   * @param {NextFunction} next - The next middleware function.
   *
   * This method logs request details when a request is received, and logs the response details when the response is finished.
   * It calculates the duration of the request-response cycle and logs error messages if the response status code is >= 400.
   */
  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();

    // Skip logging in the 'test' environment
    if (process.env.NODE_ENV !== 'test') {
      const logRequest = this.extractRequestDetails(request);

      // Log incoming request
      Logger.info(`Received ${logRequest.method} request for ${logRequest.url}`, {
        type: 'request',
        context: logRequest,
      });

      // Log response details after response is finished
      response.on('finish', () => {
        const logResponse = this.extractResponseDetails(response);
        const duration = Date.now() - startTime;

        logResponse.duration = `${duration}ms`;

        const logMessage: CustomError = {
          name: 'ResponseError',
          message: `Response sent with status ${logResponse.statusCode}`,
          type: 'response',
          context: logResponse,
        };

        // Log based on status code (error if >= 400, info otherwise)
        if (logResponse.statusCode >= 400) {
          Logger.error(logMessage.message, new Error(logMessage.message), logMessage.context);
        } else {
          Logger.info(logMessage.message, logMessage.context);
        }
      });
    }
    next();
  }

  /**
   * Extracts details from the incoming request to be logged.
   *
   * @param {Request} request - The incoming request object.
   *
   * @returns {object} - The extracted details of the request, including headers, method, URL, body, etc.
   */
  private extractRequestDetails(request: Request) {
    return {
      header: request.header('Content-Type'),
      method: request.method,
      length: request.headers['content-length'] || 0,
      url: request.originalUrl,
      route: request.route?.path || '',
      agent: request.headers['user-agent'],
      ip: request.ip,
      origin: request.headers.referer || '',
      body: request.body ? JSON.stringify(request.body) : 'No body',
    };
  }

  /**
   * Extracts details from the outgoing response to be logged.
   *
   * @param {Response} response - The outgoing response object.
   *
   * @returns {object} - The extracted details of the response, including status code, status message, etc.
   */
  private extractResponseDetails(response: Response) {
    return {
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      finished: response.finished,
      method: response.req.method,
      route: response.req.route?.path || '',
      status_code: response.statusCode,
      status_msg: response.statusMessage,
      duration: '',
    };
  }
}
