import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger for the NestJS application.
 *
 * @param {INestApplication} app - The NestJS application instance.
 *
 * @returns {Promise<void>} A promise that resolves when the Swagger setup is complete.
 *
 * The function retrieves the necessary configuration variables from the config service, such as port, application name, host, and version,
 * to configure Swagger based on the application's information. Then, the documentation is created, and Swagger is set up to be accessed
 * at the `/api` path of the application.
 */
export const swaggerSetup = async (app: INestApplication): Promise<void> => {
  const configService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<number>('PORT');
  const APP_NAME = configService.get<string>('APP_NAME');
  const APP_HOST = configService.get<string>('APP_HOST');
  const APP_VERSION = configService.get<string>('APP_VERSION');

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_NAME)
    .setVersion(APP_VERSION)
    .addServer(`http://${APP_HOST}:${PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
};
