import { ApiProperty } from '@nestjs/swagger';

export class ResponseGoogleDto {
    @ApiProperty()
    token: string;

    @ApiProperty({
        example: {
        id: 'cuid123',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@gmail.com',
        avatar: 'https://photo.jpg',
        role: 'COMERCIANTE',
        company: null,
        },
    })
    user: any;
}
