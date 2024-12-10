import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class PutUserDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;
}
