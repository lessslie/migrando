import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
    @ApiProperty({ example: 'pid789', description: 'ID del producto a marcar como favorito' })
    @IsString()
    @IsNotEmpty()
    productId: string;
}
