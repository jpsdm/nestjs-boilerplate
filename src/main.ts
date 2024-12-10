import { swaggerSetup } from '@infra/docs/swagger';
import { GlobalExceptionFilter } from '@infra/filters/global-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { AppModule } from './app.module';
import { GlobalLoggerFilter } from './infra/filters/global-logger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new GlobalLoggerFilter());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints),
          })),
        );
      },
    }),
  );

  await swaggerSetup(app);

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('PORT');
  const NODE_ENV = configService.get<string>('NODE_ENV');

  app.listen(PORT).then(() => {
    const availableRoutes: Array<object> = [];
    if (NODE_ENV === 'development') {
      const server = app.getHttpServer();
      const router = server._events.request._router as express.Router;

      router.stack.forEach((middleware) => {
        if (middleware.route) {
          availableRoutes.push({
            path: middleware.route.path,
            method: middleware.route.stack[0].method.toUpperCase(),
          });
        }
      });
    }

    if (availableRoutes.length > 0) {
      console.table(availableRoutes);
    }

    const APP_HOST = configService.get<string>('APP_HOST');
    console.table({
      'HTTP Server': `http://${APP_HOST}:${PORT}`,
      'HTTPS Server': `https://${APP_HOST}:${PORT}`,
      'Swagger Docs': `http://${APP_HOST}:${PORT}/api`,
    });
  });
}

bootstrap();
