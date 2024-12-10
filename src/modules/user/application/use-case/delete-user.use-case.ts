import { Logger } from '@infra/logger';
import { DeleteUserDTO } from '@modules/user/domain/dto';
import { UserRepository } from '@modules/user/domain/repository';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ApiResponseData, TResponseData } from '@shared/utils/api-response-data';
import { IDeleteUserUseCase } from '../ports';

@Injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

  async execute(params: DeleteUserDTO): Promise<TResponseData<void>> {
    Logger.info('DeleteUserUseCase::execute processing handler');

    try {
      await this.repository.delete(params.id);

      return ApiResponseData.success<void>({
        data: null,
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      });
    } catch (err: unknown) {
      Logger.error('DeleteUserUseCase::execute error', err);

      throw ApiResponseData.error({
        message: (err as Error).message,
        statusCode: (err as any).status,
      });
    }
  }
}
