import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty(
    {
      example: 'juan.perez@example.com',
      description: 'Email del usuario',
    }
  )
  @IsEmail() 
  email: string;
  
  @ApiProperty(
    {
      example: 'Password123!',
      description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)',
      minLength: 8,
    }
  ) @IsString(
    {
      message: 'La contraseña debe ser una cadena de texto'
    }
  ) @MinLength(1) 
  password: string;
}

