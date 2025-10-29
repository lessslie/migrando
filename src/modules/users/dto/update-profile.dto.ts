// Reemplaza updateProfileSchema
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'First name is required' })
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Last name is required' })
    lastName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}