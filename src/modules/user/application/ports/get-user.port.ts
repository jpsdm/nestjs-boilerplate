import { GetUserDTO } from '@modules/user/domain/dto';
import { TResponseData } from '@shared/utils/api-response-data';

export interface IGetUserUseCase {
  execute(params: GetUserDTO): Promise<TResponseData<GetUserDTO>>;
}
