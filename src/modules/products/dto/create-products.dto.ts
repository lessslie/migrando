// src/modules/products/dto/create-products.dto.ts
import { 
  IsArray, 
  IsBoolean, 
  IsNumber, 
  IsOptional, 
  IsString, 
  Min, 
  Max, 
  IsNotEmpty, 
  IsUrl, 
  ArrayMinSize, 
  IsEnum, 
  IsUUID,
  IsDecimal,
  ValidateNested,
  ArrayMaxSize,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

class DimensionsDto {
  @IsNumber({}, { message: 'El ancho debe ser un número' })
  @Min(0, { message: 'El ancho no puede ser negativo' })
  @Max(1000, { message: 'El ancho no puede ser mayor a 1000' })
  width: number;

  @IsNumber({}, { message: 'El alto debe ser un número' })
  @Min(0, { message: 'El alto no puede ser negativo' })
  @Max(1000, { message: 'El alto no puede ser mayor a 1000' })
  height: number;

  @IsNumber({}, { message: 'La profundidad debe ser un número' })
  @Min(0, { message: 'La profundidad no puede ser negativa' })
  @Max(1000, { message: 'La profundidad no puede ser mayor a 1000' })
  depth: number;

  @IsString({ message: 'La unidad de medida debe ser un texto' })
  @IsNotEmpty({ message: 'La unidad de medida es requerida' })
  unit: string;
}

// Enums para valores predefinidos
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  ARS = 'ARS',
  // Agrega más monedas según sea necesario
}

export enum WeightUnit {
  GRAMS = 'g',
  KILOGRAMS = 'kg',
  POUNDS = 'lb',
  OUNCES = 'oz',
}

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MaxLength(2000, { message: 'La descripción no puede tener más de 2000 caracteres' })
  description: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  @Max(1000000, { message: 'El precio no puede ser mayor a 1,000,000' })
  price: number;

  @IsEnum(Currency, { message: 'Moneda no válida' })
  currency: Currency;

  @IsString({ message: 'La categoría debe ser un texto' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  category: string;

  @IsString({ message: 'La subcategoría debe ser un texto' })
  @IsOptional()
  @MaxLength(50, { message: 'La subcategoría no puede tener más de 50 caracteres' })
  subcategory?: string;

  @IsString({ message: 'El SKU debe ser un texto' })
  @IsNotEmpty({ message: 'El SKU es requerido' })
  @MaxLength(50, { message: 'El SKU no puede tener más de 50 caracteres' })
  sku: string;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Max(1000000, { message: 'El stock no puede ser mayor a 1,000,000' })
  stock: number;

  @IsArray({ message: 'Las imágenes deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos una imagen' })
  @ArrayMaxSize(10, { message: 'No se pueden subir más de 10 imágenes' })
  @IsUrl({}, { each: true, message: 'Cada imagen debe ser una URL válida' })
  images: string[];

  @IsArray({ message: 'Los materiales deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un material' })
  @IsUUID(4, { each: true, message: 'Cada ID de material debe ser un UUID v4 válido' })
  materials: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso no puede ser negativo' })
  @Max(10000, { message: 'El peso no puede ser mayor a 10,000' })
  @IsOptional()
  weight?: number;

  @IsEnum(WeightUnit, { message: 'Unidad de peso no válida' })
  @IsOptional()
  weightUnit?: WeightUnit;

  @IsNumber({}, { message: 'La cantidad mínima debe ser un número' })
  @Min(1, { message: 'La cantidad mínima debe ser al menos 1' })
  @Max(1000, { message: 'La cantidad mínima no puede ser mayor a 1000' })
  @IsOptional()
  minOrderQuantity?: number;

  @IsNumber({}, { message: 'El tiempo de entrega debe ser un número' })
  @Min(1, { message: 'El tiempo de entrega debe ser al menos 1 día' })
  @Max(365, { message: 'El tiempo de entrega no puede ser mayor a 365 días' })
  @IsOptional()
  leadTime?: number;

  @IsBoolean({ message: 'El campo personalizable debe ser verdadero o falso' })
  @IsOptional()
  customizable: boolean = false;

  @IsArray({ message: 'Las certificaciones deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada certificación debe ser un texto' })
  @ArrayMaxSize(10, { message: 'No se pueden agregar más de 10 certificaciones' })
  @IsOptional()
  sustainabilityCertifications?: string[];

  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  @ArrayMaxSize(20, { message: 'No se pueden agregar más de 20 etiquetas' })
  @IsOptional()
  tags?: string[];

  @IsUUID(4, { message: 'El ID del fabricante debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'El ID del fabricante es requerido' })
  fabricanteId: string;

  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  @IsOptional()
  isActive: boolean = true;
}