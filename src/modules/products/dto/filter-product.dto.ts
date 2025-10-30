// src/modules/products/dto/filter-product.dto.ts
import { IsOptional, IsNumber, IsString, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterProductDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @IsOptional()
  @IsString()
  fabricanteId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}