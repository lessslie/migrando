// src/modules/products/products.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsRepository {
  private readonly include = {
    fabricante: {
      select: {
        id: true,
        companyName: true
      }
    }
  } satisfies Prisma.ProductInclude;

  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: new Prisma.Decimal(createProductDto.price).toNumber(),
      },
      include: this.include
    });

    return new Product({
      ...product,
      materials: [],
      isActive: true
    });
  }

  async findAll(filters: FilterProductDto) {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(filters.name && { name: { contains: filters.name, mode: 'insensitive' } }),
      ...(filters.category && { category: filters.category }),
      ...(filters.minPrice && { price: { gte: new Prisma.Decimal(filters.minPrice).toNumber() } }),
      ...(filters.maxPrice && { price: { lte: new Prisma.Decimal(filters.maxPrice).toNumber() } }),
      ...(filters.fabricanteId && { fabricanteId: filters.fabricanteId }),
      isActive: filters.isActive !== undefined ? filters.isActive : true
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        include: this.include
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      data: data.map(product => new Product({
        ...product,
        materials: [],
        isActive: product.isActive ?? true
      })),
      total
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.include
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return new Product({
      ...product,
      materials: [],
      isActive: product.isActive ?? true
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(updateProductDto.price && { price: new Prisma.Decimal(updateProductDto.price).toNumber() }),
      },
      include: this.include
    });

    return new Product({
      ...product,
      materials: [],
      isActive: product.isActive ?? true
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: this.include
    });

    return new Product({
      ...product,
      materials: [],
      isActive: false
    });
  }

  private getPagination(filterDto: FilterProductDto) {
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const offset = (page - 1) * limit;
    
    return { 
      limit, 
      offset, 
      ...filterDto 
    };
  }

  private buildWhereClause(filters: Omit<FilterProductDto, 'page' | 'limit' | 'sortBy' | 'sortOrder'>) {
    const where: Prisma.ProductWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = {
        ...(filters.minPrice && { gte: new Prisma.Decimal(filters.minPrice).toNumber() }),
        ...(filters.maxPrice && { lte: new Prisma.Decimal(filters.maxPrice).toNumber() })
      };
    }
    
    if (filters.fabricanteId) {
      where.fabricanteId = filters.fabricanteId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return where;
  }

  private getOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') {
    if (!sortBy) return { createdAt: 'desc' as const };
    
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      return { createdAt: 'desc' as const };
    }
    
    return { [sortBy]: sortOrder };
  }
}