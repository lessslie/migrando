// src/modules/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Product } from './entities/products.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado', type: Product })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener lista de productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: PaginatedResponseDto<Product>,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(@Query() filterDto: FilterProductDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado', type: Product })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
 async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
  await this.productsService.remove(id);
}

  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado del producto' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('active') active: string,
  ): Promise<Product> {
    return this.productsService.toggleStatus(id, active === 'true');
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Buscar productos por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productos por categoría' })
  async findByCategory(
    @Param('category') category: string,
    @Query() filterDto: Omit<FilterProductDto, 'category'>,
  ) {
    return this.productsService.findByCategory(category, filterDto);
  }
}