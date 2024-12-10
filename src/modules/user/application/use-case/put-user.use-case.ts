import { Logger } from '@infra/logger';
import { GetUserDTO, PutUserDTO } from '@modules/user/domain/dto';
import { UserRepository } from '@modules/user/domain/repository';
import { Inject, Injectable } from '@nestjs/common';
import { ApiResponseData, TResponseData } from '@shared/utils/api-response-data';
import { UserMapper } from '../mappers/user.mapper';
import { IPutUserUseCase } from '../ports';

@Injectable()
export class PutUserUseCase implements IPutUserUseCase {
  constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

  async execute(params: PutUserDTO): Promise<TResponseData<GetUserDTO>> {
    Logger.info('PutUserUseCase::execute processing handler');

    try {
      // const unityCheck = this.repository.findById(params.id);
      // if(!unityCheck){
      //   throw new Error('Unity not found.');
      // }

      const entityByDto = UserMapper.toEntity(params);
      console.log(entityByDto);
      const unity = await this.repository.update(entityByDto);
      const data = UserMapper.toDTO(unity);

      return ApiResponseData.success<GetUserDTO>({ data, message: 'User updated.' });
    } catch (err: unknown) {
      Logger.error('PutUserUseCase::execute error', err);

      return ApiResponseData.error({
        message: (err as Error).message,
        statusCode: (err as any).status,
      });
    }
  }
}
