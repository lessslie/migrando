// src/modules/auth/dto/register.dto.ts
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'contraseña123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ 
    example: 'Juan',
    description: 'Nombre del usuario'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ 
    example: 'Pérez',
    description: 'Apellido del usuario'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ 
    required: false,
    example: 'USER',
    description: 'Rol del usuario (opcional, por defecto: USER)'
  })
  @IsString()
  @IsOptional()
  role?: string;
}