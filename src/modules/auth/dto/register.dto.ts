// register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty() @IsEmail() 
  email: string;

  @ApiProperty() @IsString() @MinLength(6) 
  password: string;

  @ApiProperty() @IsString() 
  firstName: string;

  @ApiProperty() @IsString() 
  lastName: string;

  @ApiProperty() @IsString() 
  phone?: string;

  @ApiProperty({ enum: UserRole }) @IsEnum(UserRole) 
  role: UserRole;
}
