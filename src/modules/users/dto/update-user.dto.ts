// Reemplaza updateUserSchema
import { IsOptional, IsBoolean } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

// Extiende del DTO de perfil y añade campos de administración
export class UpdateUserDto extends UpdateProfileDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean;
}