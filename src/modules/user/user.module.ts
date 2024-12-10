import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './application/http/user.controller';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUserUseCase,
  PutUserUseCase,
} from './application/use-case';
import { UserEntity } from './domain/entities';
import { UserRepositoryProvider } from './domain/providers/user-repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserRepositoryProvider,
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUserUseCase,
    PutUserUseCase,
  ],
})
export class UserModule {}
