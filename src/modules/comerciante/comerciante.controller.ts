/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Put,
    Delete,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ComercianteService } from './comerciante.service';
import { CreateComercianteDto } from './dto/create-comerciante.dto';
import { UpdateComercianteDto } from './dto/update-comerciante.dto';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('Comerciantes')
@Controller('comerciante')
export class ComercianteController {
    constructor(private readonly service: ComercianteService) {}

    @Post()
    @ApiOperation({ summary: 'Crear comerciante' })
    @ApiResponse({ status: 201, description: 'Comerciante creado' })
    create(@Body() dto: CreateComercianteDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar comerciantes (paginado)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
        const p = parseInt(page, 10);
        const l = parseInt(limit, 10);
        return this.service.findAll(p, l);
    }

    @Get('me')
    @ApiOperation({ summary: 'Obtener comerciante del usuario autenticado' })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    async getMyComerciante(@Request() req: any) {
        // req.user.id debe venir del payload del JWT
        const userId = req.user?.id;
        return this.service.findByUserId(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener comerciante por id' })
    @ApiParam({ name: 'id', description: 'ID del comerciante' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar comerciante' })
    @ApiParam({ name: 'id' })
    update(@Param('id') id: string, @Body() dto: UpdateComercianteDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar comerciante' })
    @ApiParam({ name: 'id' })
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    // Inventory endpoints
    @Post(':id/inventory')
    @ApiOperation({ summary: 'Agregar / Actualizar item de inventario' })
    @ApiBody({ type: CreateInventoryItemDto })
    addInventory(@Param('id') comercianteId: string, @Body() dto: CreateInventoryItemDto) {
        return this.service.addInventory(comercianteId, dto);
    }

    @Post(':id/favorites')
    @ApiOperation({ summary: 'Agregar producto a favoritos' })
    @ApiBody({ type: FavoriteDto })
    addFavorite(@Param('id') comercianteId: string, @Body() dto: FavoriteDto) {
        return this.service.addFavorite(comercianteId, dto);
    }

    @Delete(':id/favorites/:productId')
    @ApiOperation({ summary: 'Eliminar producto de favoritos' })
    removeFavorite(@Param('id') comercianteId: string, @Param('productId') productId: string) {
        return this.service.removeFavorite(comercianteId, productId);
    }
}
