import { Logger } from '@infra/logger';
import { CreateUserDTO, GetUserDTO } from '@modules/user/domain/dto';
import { UserRepository } from '@modules/user/domain/repository';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ApiResponseData, TResponseData } from '@shared/utils/api-response-data';
import { UserMapper } from '../mappers/user.mapper';
import { ICreateUserUseCase } from '../ports';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<TResponseData<GetUserDTO>> {
    Logger.info('CreateUserUseCase::execute processing handler');

    try {
      const entityByDto = UserMapper.toEntity(dto);

      const savedEntity = await this.repository.create(entityByDto);
      const data = UserMapper.toDTO(savedEntity);

      return ApiResponseData.success<GetUserDTO>({
        data,
        statusCode: HttpStatus.CREATED,
      });
    } catch (err: unknown) {
      Logger.error('CreateUserUseCase::execute error', err);

      throw ApiResponseData.error({
        message: (err as Error).message,
        statusCode: (err as any).status,
      });
    }
  }
}
