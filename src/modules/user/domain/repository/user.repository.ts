import { Repository } from 'typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeOrmRepository } from '@shared/repositories';
import { UserEntity } from '../entities/user.entity';

export default class UserRepository extends TypeOrmRepository<UserEntity> {
  constructor(repository: Repository<UserEntity>) {
    super(repository);
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    try {
      const exists = await this.findByEmail(entity.email);

      if (exists) {
        throw new HttpException('User already exists.', HttpStatus.CONFLICT);
      }

      return this.repository.save(entity);
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.repository.findOne({ where: { email } });
  }
}
