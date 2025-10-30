import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty(
        {
            example: 'Password123999!',
            description: 'Contraseña actual',
        }
    ) 
    @IsString() @MinLength(4) 
    currentPassword: string;

    @ApiProperty(
        {
            example: 'Password123!',
            description: 'Nueva contraseña ',
        }
    ) @IsString() @MinLength(8) 
    newPassword: string;
}
