import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities';
import { UserRepository } from '../repository';

export const UserRepositoryProvider: Provider = {
  provide: 'UserRepository',
  useFactory: (dataSource: DataSource) => {
    const repository = dataSource.getRepository(UserEntity);
    return new UserRepository(repository);
  },
  inject: [DataSource],
};
