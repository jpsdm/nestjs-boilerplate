import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteUserDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ type: Number, description: 'ID of the User to be deleted.' })
  id: number;
}
