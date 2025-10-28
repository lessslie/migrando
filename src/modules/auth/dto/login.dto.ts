// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'contraseña123',
    description: 'Contraseña del usuario'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}