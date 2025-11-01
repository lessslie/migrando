import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComercianteDto {
    @ApiProperty({ example: 'Comercial SRL', description: 'Nombre comercial' })
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @ApiProperty({ example: '1234567890', description: 'RUC / CUIT / NIF' })
    @IsString()
    @IsNotEmpty()
    ruc: string;

    @ApiProperty({ example: 'Av. Principal 123', description: 'Dirección fiscal' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 'Montevideo', description: 'Ciudad' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'Uruguay', description: 'País' })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ example: 'https://miempresa.example', required: false })
    @IsOptional()
    @IsString()
    website?: string;

    @ApiProperty({ example: 'https://cdn.example/logo.png', required: false })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({ example: 'Distribuidor de ropa', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    // userId se asigna desde el flujo de Auth (o admin); si se pasa aquí permitirá asociarlo.
    @ApiProperty({ example: 'cuid123..', required: false })
    @IsOptional()
    @IsString()
    userId?: string;
}
