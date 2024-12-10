import { DeleteUserDTO } from '@modules/user/domain/dto';
import { TResponseData } from '@shared/utils/api-response-data';

export interface IDeleteUserUseCase {
  execute(params: DeleteUserDTO): Promise<TResponseData<void>>;
}
