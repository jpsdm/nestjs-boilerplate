import { CreateUserDTO, GetUserDTO } from '@modules/user/domain/dto';
import { TResponseData } from '@shared/utils/api-response-data';

export interface ICreateUserUseCase {
  execute(data: CreateUserDTO): Promise<TResponseData<GetUserDTO>>;
}
