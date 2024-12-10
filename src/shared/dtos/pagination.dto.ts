import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  readonly page: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    default: 10,
    description: 'Number of items per page',
  })
  readonly limit: number;
}
