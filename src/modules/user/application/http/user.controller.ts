import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TResponseData } from '@shared/utils/api-response-data';

import {
  CreateUserDTO,
  DeleteUserDTO,
  GetUserByIdDTO,
  GetUserDTO,
  PutUserDTO,
} from '@modules/user/domain/dto';
import { ListUserDTO } from '@modules/user/domain/dto/list-user.dto';
import { UserEntity } from '@modules/user/domain/entities';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUserUseCase,
  PutUserUseCase,
} from '../use-case';

@ApiTags('User')
@ApiExtraModels(UserEntity)
@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUserUseCase: ListUserUseCase,
    private readonly putUserUseCase: PutUserUseCase,
  ) {}

  @ApiOperation({
    summary: 'Create a new User',
    description: 'Creates a new User with the given details.',
  })
  @ApiBody({
    type: CreateUserDTO,
    description: 'Details of the User to be created.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created User',
    type: GetUserDTO,
  })
  @Post()
  create(@Body() params: CreateUserDTO): Promise<TResponseData<GetUserDTO>> {
    return this.createUserUseCase.execute(params);
  }

  @ApiOperation({
    summary: 'Get a User',
    description: 'Retrieves a User with the given ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the User',
    type: GetUserDTO,
  })
  @ApiExtraModels(GetUserByIdDTO)
  @Get(':id')
  get(@Param() params: GetUserByIdDTO): Promise<TResponseData<GetUserDTO>> {
    return this.getUserUseCase.execute(params);
  }

  @ApiOperation({
    summary: 'Get all unities paginated',
    description: 'Returns the Unity pagination and can define the grid using page and limit.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of unities',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/GetUserDTO' },
    },
  })
  @Get()
  list(@Query() query: ListUserDTO): Promise<TResponseData<GetUserDTO[]>> {
    return this.listUserUseCase.execute(query);
  }

  @ApiOperation({
    summary: 'Delete a User',
    description: 'Deletes a User with the given ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the success message',
  })
  @ApiExtraModels(DeleteUserDTO)
  @Delete(':id')
  delete(@Param() params: DeleteUserDTO): Promise<TResponseData<void>> {
    return this.deleteUserUseCase.execute(params);
  }

  @ApiOperation({
    summary: 'Update an existing User',
    description: 'Updates the details of an existing User.',
  })
  @ApiBody({ type: PutUserDTO, description: 'Updated details of the User.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated User',
    type: GetUserDTO,
  })
  @Put()
  put(@Body() params: PutUserDTO): Promise<TResponseData<GetUserDTO>> {
    return this.putUserUseCase.execute(params);
  }
}
