import { GetUserDTO, PutUserDTO } from '@modules/user/domain/dto';
import { TResponseData } from '@shared/utils/api-response-data';

export interface IPutUserUseCase {
  execute(params: PutUserDTO): Promise<TResponseData<GetUserDTO>>;
}
