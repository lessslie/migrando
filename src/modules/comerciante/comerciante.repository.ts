import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateComercianteDto } from './dto/update-comerciante.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComercianteRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Crear comerciante
    async create(data: Prisma.ComercianteCreateInput) {
        return this.prisma.comerciante.create({ data });
    }

    // Listar con paginación, filtrado y sin mostrar soft-deleted
    async findAll(params: { skip?: number; take?: number; where?: Prisma.ComercianteWhereInput }) {
        const { skip = 0, take = 20, where = {} } = params;

        return this.prisma.comerciante.findMany({
        skip,
        take,
        where: {
            ...where,
            deletedAt: null, // filtra solo los activos
        },
        include: {
            user: true,
            inventory: true,
            favorites: true,
        },
        orderBy: {
            createdAt: 'desc', // ✅ ahora sí corresponde al tipo correcto
        } as Prisma.ComercianteOrderByWithRelationInput,
        });
    }

    // Buscar por ID (incluye relaciones)
    async findById(id: string) {
        return this.prisma.comerciante.findUnique({
        where: { id },
        include: {
            user: true,
            inventory: { include: { product: true } },
            favorites: { include: { product: true } },
        },
        });
    }

    // Buscar por userId (por ejemplo para dashboard del comerciante)
    async findByUserId(userId: string) {
        return this.prisma.comerciante.findUnique({
        where: { userId },
        include: { inventory: true, favorites: true },
        });
    }

    // Actualizar datos
    async update(id: string, data: UpdateComercianteDto) {
        return this.prisma.comerciante.update({
        where: { id },
        data: { ...data, updatedAt: new Date() },
        });
    }

    // Soft delete → marca deletedAt con la fecha actual
    async remove(id: string) {
        return this.prisma.comerciante.update({
        where: { id },
        data: { deletedAt: new Date() },
        });
    }

    // Restaurar un comerciante eliminado
    async restore(id: string) {
        return this.prisma.comerciante.update({
        where: { id },
        data: { deletedAt: null },
        });
    }

    // --- Inventory helpers ---
    async addOrUpdateInventory(comercianteId: string, productId: string, quantity: number, location?: string) {
        return this.prisma.inventoryItem.upsert({
        where: { comercianteId_productId: { comercianteId, productId } },
        update: {
            quantity: { increment: quantity },
            location,
            updatedAt: new Date(),
        },
        create: {
            comercianteId,
            productId,
            quantity,
            location,
        },
        include: { product: true },
        });
    }

    // --- Favorites ---
    async addFavorite(comercianteId: string, productId: string) {
        return this.prisma.favorite.create({
        data: { comercianteId, productId },
        include: { product: true },
        });
    }

    async removeFavorite(comercianteId: string, productId: string) {
        return this.prisma.favorite.delete({
        where: { comercianteId_productId: { comercianteId, productId } },
        });
    }
}
