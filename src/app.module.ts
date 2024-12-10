import ApplicationConfig from '@infra/config/application.config';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggerModule } from '@infra/logger/logger.module';
import { AppLoggerMiddleware } from '@infra/middlewares/app-logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@modules/index';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ApplicationConfig],
    }),
    LoggerModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
