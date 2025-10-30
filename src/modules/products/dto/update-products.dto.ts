// src/modules/products/dto/update-products.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-products.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  isActive?: boolean;
}