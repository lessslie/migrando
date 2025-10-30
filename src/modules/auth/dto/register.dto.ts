import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email del usuario',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener mayúsculas, minúsculas y números',
  })
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: '+595981234567',
    description: 'Teléfono del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    enum: ['COMERCIANTE', 'FABRICANTE', 'PROVEEDOR', 'LOGISTICA'],
    example: 'COMERCIANTE',
    description: 'Rol del usuario (no puede ser ADMIN)',
  })
  @IsEnum(['COMERCIANTE', 'FABRICANTE', 'PROVEEDOR', 'LOGISTICA'], {
    message: 'El rol debe ser: COMERCIANTE, FABRICANTE, PROVEEDOR o LOGISTICA',
  })
  role: Exclude<UserRole, 'ADMIN'>; // ✅ Excluye ADMIN del tipo
}