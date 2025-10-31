import { ApiProperty } from '@nestjs/swagger';

export class CreateGoogleDto {
    @ApiProperty({
        description: 'ID token proporcionado por Google tras autenticación',
    })
    idToken: string;

    @ApiProperty({ example: 'juan@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Juan Pérez' })
    name: string;

    @ApiProperty({
        required: false,
        example: 'https://lh3.googleusercontent.com/photo.jpg',
    })
    avatarUrl?: string;
}
