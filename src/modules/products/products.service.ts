// src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.repository.create(createProductDto);
  }

  async findAll(filters: FilterProductDto) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

 async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
  await this.findOne(id);
  const updateData = {
    ...updateProductDto,
  };
  
  if (updateProductDto.price !== undefined) {
   updateData.price = updateProductDto.price;
  }

  return this.repository.update(id, updateData);
}

  async remove(id: string): Promise<Product> {
    return this.repository.remove(id);
  }

  // Método para activar/desactivar producto
// Método para activar/desactivar producto
async toggleStatus(id: string, isActive: boolean): Promise<Product> {
  await this.findOne(id); // Solo valida que el producto existe
  return this.repository.update(id, { isActive });
}

  // Métodos adicionales de negocio
  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findOne(productId);
    return product.stock >= quantity;
  }

  async updateStock(productId: string, quantity: number, action: 'add' | 'subtract'): Promise<Product> {
    const product = await this.findOne(productId);
    const newStock = action === 'add' 
      ? product.stock + quantity 
      : Math.max(0, product.stock - quantity);
    
    return this.repository.update(productId, { stock: newStock });
  }

  // Método para buscar productos por categoría
  async findByCategory(category: string, filters: Omit<FilterProductDto, 'category'>) {
    return this.repository.findAll({
      ...filters,
      category,
      page: filters.page || 1,
      limit: filters.limit || 10
    });
  }
}