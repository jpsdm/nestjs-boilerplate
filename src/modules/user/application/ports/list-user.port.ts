import { GetUserDTO } from '@modules/user/domain/dto';
import { ListUserDTO } from '@modules/user/domain/dto/list-user.dto';
import { TResponseData } from '@shared/utils/api-response-data';

export interface IListUserUseCase {
  execute(params: ListUserDTO): Promise<TResponseData<GetUserDTO[]>>;
}
