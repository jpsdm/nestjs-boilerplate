import { Global, Module } from '@nestjs/common';

import { Logger } from './logger';

export enum TLogStatus {
  ERROR = 'error',
  INFO = 'info',
}

export interface CustomError extends Error {
  type?: string;
  context?: any;
}

export interface ILogData {
  appName?: string;
  message: string;
  type: TLogStatus;
  env: string;
  timestamp: string;
  stack?: string;
  context?: string;
}

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
