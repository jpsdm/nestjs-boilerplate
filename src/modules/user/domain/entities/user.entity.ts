import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @ApiProperty()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  @IsString()
  @ApiProperty()
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @ApiProperty()
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  @IsString()
  @ApiProperty()
  password?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  updatedAt: Date;
}
