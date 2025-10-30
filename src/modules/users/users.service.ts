/* eslint-disable @typescript-eslint/no-unused-vars */
// src/modules/users/users.service.ts

import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, UserRole } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';
import type { IUserRepository } from './user.repository.interface'; // Usar 'import type' para la interfaz (solo es un tipo)
import { USER_REPOSITORY } from './user.repository.interface'; // Dejar el token como import normal (es un valor/constante)portar la Interfaz

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    // Inyectar la interfaz del Repositorio
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    ) {}

    // =========================================================================
    // RUTAS DE PERFIL DEL USUARIO (GET/PUT /profile)

    async findProfile(userId: string) {
        // Llama al Repositorio
        const userData = await this.userRepository.findUserWithProfileData(userId);

        if (!userData) {
            throw new NotFoundException('User not found');
        }

        // La lógica de negocio se queda en el Service
        const profileData = userData.comerciante || userData.fabricante || userData.logistica || userData.proveedor;

        return {
            ...userData,
            profile: profileData,
        };
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        // Llama al Repositorio
        const updatedUser = await this.userRepository.updateProfile(userId, data);

        this.logger.log(`User profile updated: ${userId}`);
        return updatedUser;
    }

    // =========================================================================
    // RUTAS DE ADMINISTRACIÓN (requieren ADMIN)

    async findAllUsers(dto: PaginationDto) {
        const skip = (dto.page - 1) * dto.limit;
        
        // La lógica de negocio/filtros se queda en el Service
        const where: Prisma.UserWhereInput = {};

        if (dto.search) {
            where.OR = [
                { firstName: { contains: dto.search, mode: 'insensitive' } },
                { lastName: { contains: dto.search, mode: 'insensitive' } },
                { email: { contains: dto.search, mode: 'insensitive' } },
            ];
        }

        if (dto.role) {
            where.role = dto.role as UserRole;
        }

        // Llama al Repositorio
        const { users: usersData, totalCount } = await this.userRepository.findAll(where, skip, dto.limit);
        
        return {
            users: usersData,
            pagination: {
                page: dto.page,
                limit: dto.limit,
                totalCount,
                totalPages: Math.ceil(totalCount / dto.limit),
            },
        };
    }

    async findUserById(id: string) {
        // Llama al Repositorio
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }

        return user;
    }
    
    async updateUser(id: string, data: UpdateUserDto, updatedBy: string) {
        // Llama al Repositorio
        const updatedUser = await this.userRepository.update(id, data);

        this.logger.warn(`User ${id} updated by Admin ${updatedBy}`);
        return updatedUser;
    }

    async deleteUser(id: string, deletedBy: string) {
        try {
            // Llama al Repositorio
            await this.userRepository.delete(id);
            this.logger.warn(`User ${id} permanently deleted by Admin ${deletedBy}`);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${id} not found.`);
            }
            throw error;
        }
    }

    // =========================================================================
    // RUTAS DE ESTADÍSTICAS

    async getUserStats(userId: string) {
        // Llama al Repositorio
        const user = await this.userRepository.findUserWithProfileData(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let stats: any = {};

        switch (user.role) {
        case UserRole.COMERCIANTE:
            stats = {
            // totalOrders: user.comerciante?.totalOrders ?? 0,
            // totalRevenue: user.comerciante?.totalRevenue ?? 0,
            // averageRating: user.comerciante?.averageRating ?? 0,
            // reviewCount: user.comerciante?.reviewCount ?? 0,
            };
            break;
        // ... otros roles (FABRICANTE, LOGISTICA, PROVEEDOR)
        }

        const accountAgeDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
            stats,
            role: user.role,
            accountAge: accountAgeDays,
        };
    }
}