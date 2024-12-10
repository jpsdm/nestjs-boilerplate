import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetUserByIdDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty()
  id: number;
}
