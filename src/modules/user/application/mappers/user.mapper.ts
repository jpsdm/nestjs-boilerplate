import { GetUserDTO } from '@modules/user/domain/dto';
import { UserEntity } from '@modules/user/domain/entities';
import { PASSWORD_SALT } from '@shared/constants';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

export class UserMapper {
  static toDTO(entity: UserEntity) {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(dto: Partial<GetUserDTO>) {
    const entity = plainToInstance(UserEntity, dto, {
      excludeExtraneousValues: true,
    });

    entity.id = dto.id ?? undefined;
    entity.name = dto.name ?? undefined;
    entity.email = dto.email ?? undefined;

    if (dto.password) {
      entity.password = this.hashPassword(dto.password);
    } else {
      entity.password = undefined;
    }

    return entity;
  }

  private static hashPassword(password: string): string {
    return bcrypt.hashSync(password, PASSWORD_SALT);
  }
}
