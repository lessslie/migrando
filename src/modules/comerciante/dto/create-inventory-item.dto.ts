import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryItemDto {
    @ApiProperty({ example: 'pid789', description: 'ID del producto (prisma cuid)' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 10, description: 'Cantidad a añadir' })
    @IsInt()
    @Min(0)
    quantity: number;

    @ApiProperty({ example: 'Bodega A', required: false })
    @IsOptional()
    @IsString()
    location?: string;
}

