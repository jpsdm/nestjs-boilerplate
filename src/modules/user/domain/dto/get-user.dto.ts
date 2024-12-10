import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';
import { CreateUserDTO } from '.';

export class GetUserDTO extends CreateUserDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsDateString()
  @ApiProperty()
  createdAt: Date;

  @IsDateString()
  @ApiProperty()
  updatedAt: Date;
}
