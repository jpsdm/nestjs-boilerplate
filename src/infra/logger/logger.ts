import { Logger as NestLogger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ILogData, TLogStatus } from './logger.module';

/**
 * Logger class for managing logs using Winston and integrating with NestJS.
 *
 * This class provides logging functionality for different log levels such as info, error, and warn,
 * and integrates with the NestJS logging system. It supports custom logging formats, console logs,
 * and file rotation for error logs.
 */
export class Logger {
  /**
   * The environment in which the application is running.
   *
   * This value is derived from the `NODE_ENV` environment variable and defaults to 'development'.
   */
  private static readonly env: string = process.env.NODE_ENV || 'development';

  /**
   * Custom formatting for logs in the console.
   *
   * This custom format ensures that logs are color-coded based on the log level (info, error, warn, debug),
   * and uses the NestJS Logger for info, error, warn, and debug levels.
   */
  private static readonly customConsoleFormat = format.printf(({ level, message, timestamp }) => {
    const colorize = (text: string, level: string) => {
      const colors: { [key: string]: string } = {
        info: '\x1b[32m', // Green
        error: '\x1b[31m', // Red
        warn: '\x1b[33m', // Yellow
        debug: '\x1b[34m', // Blue
      };
      const reset = '\x1b[0m';
      return `${colors[level] || ''}${text}${reset}`;
    };

    if (level === 'info') {
      NestLogger.log(message);
      return '';
    } else if (level === 'error') {
      NestLogger.error(message);
      return '';
    } else if (level === 'warn') {
      NestLogger.warn(message);
      return '';
    } else if (level === 'debug') {
      NestLogger.debug(message);
      return '';
    } else {
      return `${colorize(`[${timestamp}]`, level)} ${colorize(
        level.toUpperCase(),
        level,
      )}: ${message}`;
    }
  });

  /**
   * Main logger configuration using Winston.
   *
   * This configuration sets up daily log file rotation for error and combined logs, as well as a console transport
   * for logs in the terminal.
   */
  private static readonly logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      // Daily rotated error logs.
      new DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
      }),
      // Daily rotated combined logs.
      new DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
      }),
      // Console logs with custom format.
      new transports.Console({
        format: format.combine(format.timestamp(), Logger.customConsoleFormat),
      }),
    ],
  });

  /**
   * Generates structured log data.
   *
   * @param {TLogStatus} type - The type of log (info, error, etc.).
   * @param {string} message - The log message.
   * @param {any} [context] - Additional context to be logged.
   * @param {Error} [error] - The associated error object, if any.
   *
   * @returns {ILogData} - The structured log data.
   *
   * This method formats the log data with relevant information such as the application name, environment,
   * timestamp, stack trace (if available), and additional context.
   */
  private static getLogData(
    type: TLogStatus,
    message: string,
    context?: any,
    error?: Error,
  ): ILogData {
    return {
      appName: process.env.APP_NAME || 'APP NAME UNDEFINED',
      message: error?.message || message,
      type,
      env: Logger.env,
      timestamp: new Date().toISOString(),
      stack: error?.stack,
      context: context ? JSON.stringify(context) : undefined,
    };
  }

  /**
   * Logs error messages.
   *
   * @param {string} message - The error message to be logged.
   * @param {Error | any} error - The error object or any associated error data.
   * @param {any} [context] - Additional context for the error.
   *
   * This method logs an error message with structured data, including the error message, stack trace, and additional context.
   */
  static error(message: string, error: Error | any, context?: any): void {
    const errorContext = context ?? {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    };

    const logData = Logger.getLogData(TLogStatus.ERROR, message, errorContext, error);

    Logger.logger.error(JSON.stringify(logData));
  }

  /**
   * Logs informational messages.
   *
   * @param {string} message - The message to be logged.
   * @param {any} [context] - Additional context for the informational log.
   *
   * This method logs an informational message with structured data, including the message and any additional context.
   */
  static info(message: string, context?: any): void {
    const logData = Logger.getLogData(TLogStatus.INFO, message, context);

    Logger.logger.info(JSON.stringify(logData));
  }
}
