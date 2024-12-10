import { Logger } from '@infra/logger';
import { DeleteUserDTO, GetUserDTO } from '@modules/user/domain/dto';
import { UserRepository } from '@modules/user/domain/repository';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ApiResponseData, TResponseData } from '@shared/utils/api-response-data';
import { UserMapper } from '../mappers/user.mapper';
import { IGetUserUseCase } from '../ports';

@Injectable()
export class GetUserUseCase implements IGetUserUseCase {
  constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

  async execute(params: DeleteUserDTO): Promise<TResponseData<GetUserDTO>> {
    Logger.info('GetUserUseCase::execute processing handler');

    try {
      const entity = await this.repository.findById(params.id);
      const data = UserMapper.toDTO(entity);

      return ApiResponseData.success<GetUserDTO>({
        data,
        statusCode: HttpStatus.OK,
      });
    } catch (err: unknown) {
      Logger.error('GetUserUseCase::execute error', err);

      throw ApiResponseData.error({
        message: (err as Error).message,
        statusCode: (err as any).status,
      });
    }
  }
}
