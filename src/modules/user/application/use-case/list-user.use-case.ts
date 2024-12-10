import { Logger } from '@infra/logger';
import { GetUserDTO } from '@modules/user/domain/dto';
import { ListUserDTO } from '@modules/user/domain/dto/list-user.dto';
import { UserEntity } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/domain/repository';
import { Inject, Injectable } from '@nestjs/common';
import { C_E_PAGINATION_OPTION } from '@shared/constants';
import {
  ApiResponseData,
  TPaginationOptions,
  TPaginationResult,
  TResponseData,
} from '@shared/utils/api-response-data';
import { UserMapper } from '../mappers/user.mapper';
import { IListUserUseCase } from '../ports/list-user.port';

@Injectable()
export class ListUserUseCase implements IListUserUseCase {
  constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

  async execute(params: ListUserDTO): Promise<TResponseData<GetUserDTO[]>> {
    Logger.info('ListUserUseCase::execute processing handler');

    const { page = 1, limit = 10 } = params;

    const paginationOptions: TPaginationOptions<any> = this.getPaginationOptions(params);
    let pagination: TPaginationResult;

    try {
      const { entities, total } = await this.repository.paginate(paginationOptions);

      pagination = this.repository.paginateRange({ total, limit, page });
      const data = entities.map(UserMapper.toDTO);

      return ApiResponseData.success<GetUserDTO[]>({ data, pagination });
    } catch (err: unknown) {
      Logger.error('ListUserUseCase::execute error', err);

      return ApiResponseData.error({
        message: (err as Error).message,
        statusCode: (err as any).status,
      });
    }
  }

  private getPaginationOptions = (queryParams: ListUserDTO): TPaginationOptions<UserEntity> => {
    return {
      limit: +queryParams.limit || C_E_PAGINATION_OPTION.PER_PAGE,
      page: +queryParams.page || C_E_PAGINATION_OPTION.INITIAL_PAGE,
    };
  };
}
