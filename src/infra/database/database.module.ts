import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ORM_CONFIG from './typeorm/typeorm.config';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          ...ORM_CONFIG,
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
