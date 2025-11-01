import { Injectable, NotFoundException } from '@nestjs/common';
import { ComercianteRepository } from './comerciante.repository';
import { CreateComercianteDto } from './dto/create-comerciante.dto';
import { UpdateComercianteDto } from './dto/update-comerciante.dto';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class ComercianteService {
    constructor(private readonly repo: ComercianteRepository) {}

    async create(dto: CreateComercianteDto) {
        const { userId, ...rest } = dto;
        const data = {
            ...rest,
            user: { connect: { id: userId } }, // Prisma espera relación, no userId directo
        };
        return this.repo.create(data);
    }
    
    findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repo.findAll({ skip, take: limit });
    }

    async findOne(id: string) {
        const c = await this.repo.findById(id);
        if (!c) throw new NotFoundException('Comerciante no encontrado');
        return c;
    }

    async findByUserId(userId: string) {
        const c = await this.repo.findByUserId(userId);
        if (!c) throw new NotFoundException('Comerciante del usuario no encontrado');
        return c;
    }

    update(id: string, dto: UpdateComercianteDto) {
        return this.repo.update(id, dto);
    }

    remove(id: string) {
        return this.repo.remove(id);
    }

    // Inventory
    addInventory(comercianteId: string, dto: CreateInventoryItemDto) {
        return this.repo.addOrUpdateInventory(comercianteId, dto.productId, dto.quantity, dto.location);
    }

    // Favorites
    addFavorite(comercianteId: string, dto: FavoriteDto) {
        return this.repo.addFavorite(comercianteId, dto.productId);
    }

    removeFavorite(comercianteId: string, productId: string) {
        return this.repo.removeFavorite(comercianteId, productId);
    }
}
